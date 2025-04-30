/**
 * AI Service
 * Handles AI analytics and predictions using OpenAI API
 */

const logger = require('../utils/logger');
const supabase = require('./supabaseService');
const OpenAI = require('openai');

let openai;

/**
 * Initialize the OpenAI client
 */
const initOpenAI = () => {
  try {
    if (!process.env.OPENAI_API_KEY) {
      logger.error('OPENAI_API_KEY not set in environment');
      return false;
    }

    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    logger.info('OpenAI client initialized successfully');
    return true;
  } catch (error) {
    logger.error('Error initializing OpenAI client:', error.message);
    return false;
  }
};

/**
 * Check if OpenAI API is available
 */
const isOpenAIAvailable = async () => {
  if (!openai) {
    return false;
  }

  try {
    // Simple call to check if the API is responsive
    await openai.models.list();
    return true;
  } catch (error) {
    logger.error('OpenAI API connection failed:', error.message);
    return false;
  }
};

/**
 * Get employee data for AI analysis
 * @param {string} employeeId - Database UUID of the employee
 * @returns {Object} Employee data for analysis
 */
const getEmployeeDataForAnalysis = async (employeeId) => {
  try {
    // Get employee basic info
    const { data: employee, error: employeeError } = await supabase
      .from('employees')
      .select('*, roles(role_name), departments(dept_name)')
      .eq('id', employeeId)
      .single();

    if (employeeError) {
      logger.error('Error fetching employee data for AI analysis:', employeeError);
      return { success: false, error: employeeError };
    }

    // Get leave records
    const { data: leaves, error: leavesError } = await supabase
      .from('leaves')
      .select('*')
      .eq('emp_id', employeeId);

    if (leavesError) {
      logger.error('Error fetching employee leave data for AI analysis:', leavesError);
      return { success: false, error: leavesError };
    }

    // Get certificate records
    const { data: certificates, error: certificatesError } = await supabase
      .from('certificates')
      .select('*')
      .eq('emp_id', employeeId);

    if (certificatesError) {
      logger.error('Error fetching employee certificate data for AI analysis:', certificatesError);
      return { success: false, error: certificatesError };
    }

    // Get payroll records
    const { data: payrolls, error: payrollsError } = await supabase
      .from('payrolls')
      .select('*')
      .eq('emp_id', employeeId);

    if (payrollsError) {
      logger.error('Error fetching employee payroll data for AI analysis:', payrollsError);
      return { success: false, error: payrollsError };
    }

    // Compile all data for analysis
    const analysisData = {
      employee: {
        id: employee.id,
        name: employee.name,
        role: employee.roles?.role_name || 'Unknown Role',
        department: employee.departments?.dept_name || 'Unknown Department',
        doj: employee.doj,
        status: employee.status
      },
      leaves: leaves.map(leave => ({
        days: leave.days,
        reason: leave.reason,
        status: leave.status,
        submitted_at: leave.submitted_at
      })),
      certificates: certificates.map(cert => ({
        skill_name: cert.skill_name,
        created_at: cert.created_at
      })),
      payrolls: payrolls.map(payroll => ({
        amount: payroll.amount,
        timestamp: payroll.timestamp
      }))
    };

    return { success: true, data: analysisData };
  } catch (error) {
    logger.error('Exception getting employee data for AI analysis:', error);
    return { success: false, error };
  }
};

/**
 * Analyze employee data and generate risk assessment
 * @param {Object} employeeData - Compiled employee data for analysis
 * @returns {Object} AI analysis result
 */
const analyzeEmployeeRisk = async (employeeData) => {
  if (!openai) {
    logger.warn('OpenAI client not initialized');
    return { success: false, reason: 'OpenAI client not initialized' };
  }

  try {
    // Check if OpenAI API is available
    if (!await isOpenAIAvailable()) {
      return { success: false, reason: 'OpenAI API not available' };
    }

    // Construct the prompt for OpenAI
    const systemPrompt = `You are an HR analytics expert. Analyze the following employee data and provide:
1. A risk level assessment (LOW, MEDIUM, or HIGH)
2. Key factors contributing to this risk level
3. Three actionable recommendations for HR
Base your analysis on patterns in leave history, certification achievements, and other relevant factors.`;

    // Make API call to OpenAI
    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: JSON.stringify(employeeData, null, 2) }
      ],
      temperature: 0.3,
      max_tokens: 1000
    });

    if (!response.choices || response.choices.length === 0) {
      throw new Error('Empty response from OpenAI API');
    }

    // Extract and parse the AI response
    const aiResponse = response.choices[0].message.content;

    // Extract risk level (assuming the AI will mention it in the response)
    let riskLevel = 'MEDIUM'; // Default
    if (aiResponse.includes('LOW') || aiResponse.toLowerCase().includes('low risk')) {
      riskLevel = 'LOW';
    } else if (aiResponse.includes('HIGH') || aiResponse.toLowerCase().includes('high risk')) {
      riskLevel = 'HIGH';
    }

    // Extract suggestions (simplified parsing - in production would be more robust)
    const suggestions = aiResponse
      .split('\n')
      .filter(line => line.includes('recommendation') || line.includes('Recommendation') || line.includes('suggest') || line.match(/^\d+\./))
      .map(line => line.replace(/^\d+\.\s*/, '').trim())
      .filter(line => line.length > 0);

    // Create structured result
    const analysisResult = {
      riskLevel,
      fullAnalysis: aiResponse,
      suggestions: suggestions.length > 0 ? suggestions : ['No specific recommendations found'],
    };

    return { success: true, data: analysisResult };
  } catch (error) {
    logger.error('Error in AI analysis:', error.message);
    return { success: false, reason: error.message };
  }
};

/**
 * Save AI analysis result to database
 * @param {string} employeeId - Database UUID of the employee
 * @param {Object} inputData - Data used for analysis
 * @param {Object} analysisResult - AI analysis result
 * @returns {Object} Database insert result
 */
const saveAIAnalysisLog = async (employeeId, inputData, analysisResult) => {
  try {
    const { data, error } = await supabase
      .from('ai_logs')
      .insert({
        emp_id: employeeId,
        log_input: inputData,
        risk_level: analysisResult.riskLevel,
        suggestions: { suggestions: analysisResult.suggestions, full_analysis: analysisResult.fullAnalysis }
      });

    if (error) {
      logger.error('Error saving AI analysis log to database:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    logger.error('Exception saving AI analysis log to database:', error);
    return { success: false, error };
  }
};

/**
 * Get AI analysis history for an employee
 * @param {string} employeeId - Database UUID of the employee
 * @returns {Array} AI analysis logs for the employee
 */
const getEmployeeAIHistory = async (employeeId) => {
  try {
    const { data, error } = await supabase
      .from('ai_logs')
      .select('*')
      .eq('emp_id', employeeId)
      .order('timestamp', { ascending: false });

    if (error) {
      logger.error('Error fetching employee AI history:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    logger.error('Exception fetching employee AI history:', error);
    return { success: false, error };
  }
};

/**
 * Get all AI analysis logs with pagination
 * @param {number} page - Page number
 * @param {number} limit - Records per page
 * @returns {Array} AI analysis logs
 */
const getAllAILogs = async (page = 1, limit = 10) => {
  const from = (page - 1) * limit;
  const to = from + limit - 1;
  
  try {
    const { data, error, count } = await supabase
      .from('ai_logs')
      .select('*, employees!inner(name, email)', { count: 'exact' })
      .range(from, to)
      .order('timestamp', { ascending: false });

    if (error) {
      logger.error('Error fetching all AI logs:', error);
      return { success: false, error };
    }

    return { 
      success: true, 
      data,
      pagination: {
        total: count,
        page,
        limit,
        pages: Math.ceil(count / limit)
      }
    };
  } catch (error) {
    logger.error('Exception fetching all AI logs:', error);
    return { success: false, error };
  }
};

// Initialize OpenAI client on module load
const initialized = initOpenAI();

module.exports = {
  isOpenAIAvailable,
  getEmployeeDataForAnalysis,
  analyzeEmployeeRisk,
  saveAIAnalysisLog,
  getEmployeeAIHistory,
  getAllAILogs
}; 