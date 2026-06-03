export type NormalResponse = {
  interaction_types: string[];
  drugs: string[];
  foods: string[];
  herbs: string[];
  corrected_query: string;
  final_output: string;
};

export type ClarificationCorrection = {
  original: string;
  corrected: string;
  type: string;
};

export type ClarificationResponse = {
  corrections: ClarificationCorrection[];
  message: string;
  thread_id: string;
  type: "clarification" | "spelling" | "both";
};

export type UserMessage = {
  role: "user";
  content: string;
};

export type BotNormalMessage = {
  role: "bot";
  type: "normal";
  data: NormalResponse;
};

export type BotClarificationMessage = {
  role: "bot";
  type: "clarification";
  message: string;
  threadId: string;
  corrections: ClarificationCorrection[];
};

export type BotMissingMessage = {
  role: "bot";
  type: "missing";
  message: string;
  threadId: string;
};

export type BotErrorMessage = {
  role: "bot";
  type: "error";
  content: string;
};

export type ChatMessage =
  | UserMessage
  | BotNormalMessage
  | BotClarificationMessage
  | BotErrorMessage
  | BotMissingMessage;
