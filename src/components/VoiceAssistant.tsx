"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Mic, MicOff, Volume2, VolumeX, MessageSquare, AlertTriangle } from "lucide-react";

interface VoiceCommand {
  command: string;
  action: string;
  description: string;
}

export default function VoiceAssistant() {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [lastCommand, setLastCommand] = useState<string>("");
  const [response, setResponse] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [supported, setSupported] = useState(true);
  const [language, setLanguage] = useState("en-US");

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const synthesisRef = useRef<SpeechSynthesis | null>(null);

  const voiceCommands: VoiceCommand[] = [
    {
      command: "identify plant",
      action: "navigate",
      description: "Navigate to plant identification"
    },
    {
      command: "detect disease",
      action: "navigate",
      description: "Navigate to disease detection"
    },
    {
      command: "fertilizer calculator",
      action: "navigate",
      description: "Navigate to fertilizer calculator"
    },
    {
      command: "cultivation tips",
      action: "navigate",
      description: "Navigate to cultivation tips"
    },
    {
      command: "weather",
      action: "navigate",
      description: "Navigate to weather information"
    },
    {
      command: "home",
      action: "navigate",
      description: "Go to home page"
    },
    {
      command: "help",
      action: "help",
      description: "Get help with voice commands"
    },
    {
      command: "stop",
      action: "stop",
      description: "Stop voice assistant"
    }
  ];

  useEffect(() => {
    // Check browser support
    const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
    const SpeechSynthesis = window.speechSynthesis;
    
    if (!SpeechRecognition || !SpeechSynthesis) {
      setSupported(false);
      setError("Voice recognition not supported in this browser");
      return;
    }

    // Initialize speech recognition
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = false;
    recognitionRef.current.lang = language;

    recognitionRef.current.onresult = (event) => {
      const command = event.results[0][0].transcript.toLowerCase();
      setLastCommand(command);
      processCommand(command);
    };

    recognitionRef.current.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setError(`Speech recognition error: ${event.error}`);
      setIsListening(false);
    };

    recognitionRef.current.onend = () => {
      setIsListening(false);
    };

    // Initialize speech synthesis
    synthesisRef.current = SpeechSynthesis;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (synthesisRef.current) {
        synthesisRef.current.cancel();
      }
    };
  }, [language]);

  const startListening = () => {
    if (!supported || !recognitionRef.current) return;
    
    setError("");
    setIsListening(true);
    setLastCommand("");
    setResponse("");
    
    try {
      recognitionRef.current.start();
      speak("Listening for your command...");
    } catch (err) {
      console.error('Error starting recognition:', err);
      setError("Failed to start voice recognition");
      setIsListening(false);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  };

  const speak = (text: string) => {
    if (!synthesisRef.current) return;

    setIsSpeaking(true);
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language;
    utterance.rate = 0.9;
    utterance.pitch = 1;
    
    utterance.onend = () => {
      setIsSpeaking(false);
    };
    
    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event.error);
      setIsSpeaking(false);
    };
    
    synthesisRef.current.speak(utterance);
  };

  const processCommand = (command: string) => {
    let matchedCommand: VoiceCommand | null = null;
    let responseText = "";

    // Find matching command
    for (const voiceCmd of voiceCommands) {
      if (command.includes(voiceCmd.command)) {
        matchedCommand = voiceCmd;
        break;
      }
    }

    if (matchedCommand) {
      switch (matchedCommand.action) {
        case "navigate":
          const tabMap: Record<string, string> = {
            "identify plant": "plant",
            "detect disease": "disease",
            "fertilizer calculator": "fertilizer",
            "cultivation tips": "tips",
            "weather": "weather",
            "home": "home"
          };
          
          const tabName = tabMap[matchedCommand.command];
          if (tabName) {
            // Find and click the tab
            const tabElement = document.querySelector(`[value="${tabName}"]`) as HTMLElement;
            if (tabElement) {
              tabElement.click();
              responseText = `Navigating to ${matchedCommand.description}`;
            } else {
              responseText = `Could not find ${matchedCommand.description} page`;
            }
          }
          break;
          
        case "help":
          responseText = "Available commands: " + voiceCommands.map(cmd => cmd.command).join(", ");
          break;
          
        case "stop":
          responseText = "Voice assistant stopped";
          break;
          
        default:
          responseText = "Command not recognized";
      }
    } else {
      // Try to understand general commands
      if (command.includes("hello") || command.includes("hi")) {
        responseText = "Hello! I'm your farming assistant. How can I help you today?";
      } else if (command.includes("thank")) {
        responseText = "You're welcome! Happy farming!";
      } else if (command.includes("weather")) {
        responseText = "I can help you check the weather. Navigate to the weather page for detailed information.";
      } else if (command.includes("plant") || command.includes("crop")) {
        responseText = "I can help you identify plants and detect diseases. Navigate to the respective pages for assistance.";
      } else {
        responseText = "I didn't understand that command. Try saying 'help' for available commands.";
      }
    }

    setResponse(responseText);
    speak(responseText);
  };

  const toggleLanguage = () => {
    const newLanguage = language === "en-US" ? "hi-IN" : "en-US";
    setLanguage(newLanguage);
    if (recognitionRef.current) {
      recognitionRef.current.lang = newLanguage;
    }
    speak(newLanguage === "en-US" ? "Language changed to English" : "भाषा हिंदी में बदली गई");
  };

  const speakHelp = () => {
    const helpText = language === "en-US" 
      ? "Available voice commands: " + voiceCommands.map(cmd => cmd.command).join(", ") + ". You can also say hello or ask for help."
      : "उपलब्ध वॉयस कमांड: " + voiceCommands.map(cmd => cmd.command).join(", ") + ". आप हैलो भी कह सकते हैं या मदद मांग सकते हैं।";
    
    speak(helpText);
  };

  return (
    <div className="relative">
      <Button
        onClick={isListening ? stopListening : startListening}
        variant={isListening ? "destructive" : "outline"}
        size="sm"
        disabled={!supported || isSpeaking}
        className="relative"
      >
        {isListening ? (
          <>
            <MicOff className="w-4 h-4 mr-2" />
            Stop
            <div className="absolute -top-1 -right-1">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            </div>
          </>
        ) : (
          <>
            <Mic className="w-4 h-4 mr-2" />
            Voice
          </>
        )}
      </Button>

      {/* Voice Assistant Panel */}
      {isListening || lastCommand || response || error ? (
        <Card className="absolute top-full right-0 mt-2 w-80 z-50 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2">
                <MessageSquare className="w-4 h-4" />
                <span>Voice Assistant</span>
              </div>
              <div className="flex items-center space-x-1">
                <Badge variant="outline" className="text-xs">
                  {language === "en-US" ? "EN" : "HI"}
                </Badge>
                <Button
                  onClick={toggleLanguage}
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                >
                  <Volume2 className="w-3 h-3" />
                </Button>
              </div>
            </CardTitle>
            <CardDescription className="text-xs">
              {isListening ? "Listening for commands..." : "Voice assistant ready"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {error && (
              <Alert variant="destructive" className="py-2">
                <AlertTriangle className="h-3 w-3" />
                <AlertDescription className="text-xs">{error}</AlertDescription>
              </Alert>
            )}

            {lastCommand && (
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <Mic className="w-3 h-3 text-blue-600" />
                  <span className="text-xs font-medium">Command:</span>
                </div>
                <p className="text-sm bg-blue-50 dark:bg-blue-900/20 p-2 rounded">
                  {lastCommand}
                </p>
              </div>
            )}

            {response && (
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <Volume2 className="w-3 h-3 text-green-600" />
                  <span className="text-xs font-medium">Response:</span>
                  {isSpeaking && (
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  )}
                </div>
                <p className="text-sm bg-green-50 dark:bg-green-900/20 p-2 rounded">
                  {response}
                </p>
              </div>
            )}

            <div className="flex gap-2 pt-2">
              <Button
                onClick={speakHelp}
                variant="outline"
                size="sm"
                className="flex-1 text-xs"
                disabled={isSpeaking}
              >
                <Volume2 className="w-3 h-3 mr-1" />
                Help
              </Button>
              <Button
                onClick={() => {
                  setLastCommand("");
                  setResponse("");
                  setError("");
                }}
                variant="ghost"
                size="sm"
                className="text-xs"
              >
                Clear
              </Button>
            </div>

            <div className="text-xs text-gray-500 dark:text-gray-400 pt-2 border-t">
              <p className="font-medium mb-1">Try saying:</p>
              <div className="space-y-1">
                {voiceCommands.slice(0, 3).map((cmd, index) => (
                  <p key={index} className="text-xs">• "{cmd.command}"</p>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      ) : null}

      {!supported && (
        <Alert variant="destructive" className="absolute top-full right-0 mt-2 w-64 z-50">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="text-xs">
            Voice recognition not supported in this browser
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}