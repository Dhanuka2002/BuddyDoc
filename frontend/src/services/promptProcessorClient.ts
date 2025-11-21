/**
 * Prompt Processor API Client
 * 
 * TypeScript/JavaScript client for the Prompt Processor service.
 * Use this in your React Native frontend to process user chat messages.
 */

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export interface ChatMessageRequest {
  message: string;
  conversation_history?: string[];
  user_id?: string;
}

export interface Entity {
  type: string;
  value: string;
  [key: string]: any;
}

export interface ChatMessageResponse {
  success: boolean;
  intent: string;
  entities: Entity[];
  context: Record<string, any>;
  medical_concerns: string[];
  action_required: string;
  confidence: number;
  raw_message: string;
  llm_response?: string;
}

export interface SymptomExtractionRequest {
  message: string;
  user_id?: string;
}

export interface Symptom {
  name: string;
  severity: number;
  onset?: string;
  duration?: string;
  location?: string;
  triggers?: string;
  characteristics?: string;
}

export interface SymptomExtractionResponse {
  success: boolean;
  symptoms: Symptom[];
  urgency: 'low' | 'medium' | 'high' | 'critical';
  recommended_action: string;
  confidence: number;
  raw_message: string;
}

export class PromptProcessorClient {
  private baseUrl: string;
  private authToken?: string;

  constructor(baseUrl: string = API_BASE_URL, authToken?: string) {
    this.baseUrl = baseUrl;
    this.authToken = authToken;
  }

  /**
   * Set authentication token
   */
  setAuthToken(token: string) {
    this.authToken = token;
  }

  /**
   * Get headers for API requests
   */
  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (this.authToken) {
      headers['Authorization'] = `Bearer ${this.authToken}`;
    }

    return headers;
  }

  /**
   * Process a chat message and extract semantic meaning
   */
  async processChatMessage(
    request: ChatMessageRequest
  ): Promise<ChatMessageResponse> {
    const response = await fetch(`${this.baseUrl}/chat/process`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  }

  /**
   * Extract structured symptom information
   */
  async extractSymptoms(
    request: SymptomExtractionRequest
  ): Promise<SymptomExtractionResponse> {
    const response = await fetch(`${this.baseUrl}/chat/extract-symptoms`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  }

  /**
   * Check service health
   */
  async healthCheck(): Promise<{
    status: string;
    service: string;
    llm_model: string;
    project: string;
    location: string;
  }> {
    const response = await fetch(`${this.baseUrl}/chat/health`, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  }
}

// Export singleton instance
export const promptProcessorClient = new PromptProcessorClient();

// Example usage functions

/**
 * Example: Process a user message and handle different intents
 */
export async function handleUserMessage(
  message: string,
  userId: string,
  conversationHistory: string[] = []
): Promise<void> {
  try {
    const result = await promptProcessorClient.processChatMessage({
      message,
      user_id: userId,
      conversation_history: conversationHistory,
    });

    console.log('Processing result:', result);

    // Handle different intents
    switch (result.intent) {
      case 'log_symptom':
        // Navigate to symptom logging screen
        console.log('Navigate to symptom logging');
        console.log('Medical concerns:', result.medical_concerns);
        // navigateToSymptomLog(result);
        break;

      case 'prepare_consultation':
        // Navigate to consultation prep screen
        console.log('Navigate to consultation preparation');
        // navigateToConsultationPrep(result);
        break;

      case 'record_medication':
        // Navigate to medication recording
        console.log('Navigate to medication recording');
        // navigateToMedicationLog(result);
        break;

      case 'ask_question':
        // Show AI response or FAQ
        console.log('User has a question');
        // showAIResponse(result);
        break;

      default:
        console.log('General query or unknown intent');
        // handleGeneralQuery(result);
    }

    // Check if urgent action is required
    if (result.action_required === 'trigger_alert') {
      console.warn('URGENT: Immediate action required!');
      // showUrgentAlert(result.medical_concerns);
    }
  } catch (error) {
    console.error('Error processing message:', error);
    throw error;
  }
}

/**
 * Example: Extract symptoms from a message
 */
export async function analyzeSymptoms(
  symptomDescription: string,
  userId: string
): Promise<SymptomExtractionResponse> {
  try {
    const result = await promptProcessorClient.extractSymptoms({
      message: symptomDescription,
      user_id: userId,
    });

    console.log('Symptom analysis:', result);

    // Handle urgency levels
    if (result.urgency === 'critical' || result.urgency === 'high') {
      console.warn('HIGH URGENCY SYMPTOMS DETECTED');
      // showUrgentCareAlert(result);
    }

    return result;
  } catch (error) {
    console.error('Error analyzing symptoms:', error);
    throw error;
  }
}

/**
 * Example: React Native component usage
 */
export const ChatScreenExample = `
import React, { useState } from 'react';
import { View, TextInput, Button, Text } from 'react-native';
import { handleUserMessage } from './promptProcessorClient';

export const ChatScreen = () => {
  const [message, setMessage] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const onSendMessage = async () => {
    if (!message.trim()) return;
    
    setLoading(true);
    try {
      await handleUserMessage(message, 'user123');
      setMessage('');
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View>
      <TextInput
        value={message}
        onChangeText={setMessage}
        placeholder="Describe your symptoms..."
        multiline
      />
      <Button
        title={loading ? 'Processing...' : 'Send'}
        onPress={onSendMessage}
        disabled={loading}
      />
      {result && (
        <View>
          <Text>Intent: {result.intent}</Text>
          <Text>Confidence: {result.confidence}</Text>
        </View>
      )}
    </View>
  );
};
`;

export default promptProcessorClient;
