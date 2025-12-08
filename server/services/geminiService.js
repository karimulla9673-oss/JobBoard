import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the client with an options object. Also guard against missing keys.
if (!process.env.GEMINI_API_KEY) {
  console.warn('GEMINI_API_KEY is not set. Gemini extraction will be disabled.');
}

const genAI = new GoogleGenerativeAI({ apiKey: process.env.GEMINI_API_KEY });

export const extractJobDetailsFromImage = async (imageBuffer) => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY not configured');
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // Convert buffer to base64
    const base64Image = imageBuffer.toString('base64');

    const prompt = `Analyze this job poster image and extract the following information in valid JSON format. If any field is not found or unclear, use null for that field.

Required fields to extract:
{
  "title": "Job title/position",
  "company": "Company name",
  "location": "Job location (city, state, country)",
  "jobType": "One of: Full-time, Part-time, Internship, Remote, Hybrid, or Contract",
  "email": "Contact email address",
  "contactNumber": "Phone/contact number",
  "applyLink": "Application URL or company website",
  "description": "Brief job description if visible"
}

Important rules:
1. Return ONLY valid JSON, no additional text or markdown
2. Use null for any field that cannot be found
3. For jobType, choose the closest match from: Full-time, Part-time, Internship, Remote, Hybrid, Contract
4. Ensure email is in valid format
5. Ensure URLs start with http:// or https://
6. Keep description under 500 characters

Example response:
{
  "title": "Senior Software Engineer",
  "company": "Tech Corp",
  "location": "San Francisco, CA",
  "jobType": "Full-time",
  "email": "jobs@techcorp.com",
  "contactNumber": "+1-555-0123",
  "applyLink": "https://techcorp.com/careers",
  "description": "Looking for experienced developer..."
}`;

    const imagePart = {
      inlineData: {
        data: base64Image,
        mimeType: 'image/jpeg',
      },
    };

    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    const text = response.text();

    // Clean the response - remove markdown code blocks if present
    let cleanedText = text.trim();
    if (cleanedText.startsWith('```json')) {
      cleanedText = cleanedText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    } else if (cleanedText.startsWith('```')) {
      cleanedText = cleanedText.replace(/```\n?/g, '');
    }

    // Parse JSON
    const jobDetails = JSON.parse(cleanedText);

    // Validate and sanitize the extracted data
    const sanitizedDetails = {
      title: jobDetails.title || null,
      company: jobDetails.company || null,
      location: jobDetails.location || null,
      jobType: validateJobType(jobDetails.jobType),
      email: validateEmail(jobDetails.email),
      contactNumber: jobDetails.contactNumber || null,
      applyLink: validateUrl(jobDetails.applyLink),
      description: jobDetails.description ? jobDetails.description.substring(0, 500) : null,
    };

    return {
      success: true,
      data: sanitizedDetails,
      confidence: calculateConfidence(sanitizedDetails),
    };
  } catch (error) {
    console.error('Gemini API Error:', error);
    return {
      success: false,
      error: error.message,
      data: {
        title: null,
        company: null,
        location: null,
        jobType: 'Full-time',
        email: null,
        contactNumber: null,
        applyLink: null,
        description: null,
      },
    };
  }
};

// Helper function to validate job type
const validateJobType = (jobType) => {
  const validTypes = ['Full-time', 'Part-time', 'Internship', 'Remote', 'Hybrid', 'Contract'];
  
  if (!jobType) return 'Full-time';
  
  // Find closest match (case-insensitive)
  const match = validTypes.find(
    type => type.toLowerCase() === jobType.toLowerCase()
  );
  
  return match || 'Full-time';
};

// Helper function to validate email
const validateEmail = (email) => {
  if (!email) return null;
  
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return emailRegex.test(email) ? email : null;
};

// Helper function to validate URL
const validateUrl = (url) => {
  if (!url) return null;
  
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:' ? url : null;
  } catch {
    // Try adding https:// if missing
    if (!url.startsWith('http')) {
      try {
        new URL('https://' + url);
        return 'https://' + url;
      } catch {
        return null;
      }
    }
    return null;
  }
};

// Calculate confidence score based on how many fields were extracted
const calculateConfidence = (details) => {
  const fields = ['title', 'company', 'location', 'email', 'contactNumber', 'applyLink'];
  const filledFields = fields.filter(field => details[field] !== null).length;
  return Math.round((filledFields / fields.length) * 100);
};