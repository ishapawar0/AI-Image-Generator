import Chat from "../models/chat.js";
import User from "../models/user.js";
import axios from "axios";
import imagekit from "../config/imageKit.js";
import genAI from "../config/openAi.js";

// Text Generation Controller
export const textMessageController = async (req, res) => {
  try {
    const userId = req.user._id;

    if (req.user.credits < 1) {
      return res.json({
        success: false,
        message: "You don't have enough credits to use this feature",
      });
    }

    const { chatId, prompt } = req.body;

    const chat = await Chat.findOne({ userId, _id: chatId });
    if (!chat) {
      return res.status(404).json({ success: false, message: "Chat not found" });
    }

    // ✨ Title Summary Logic
    if (chat.messages.length === 0) {
      chat.name = prompt.trim().slice(0, 30) + (prompt.length > 30 ? "..." : "");
    }

    chat.messages.push({
      role: "user",
      content: prompt,
      timestamp: Date.now(),
      isImage: false,
    });

    const model = genAI.getGenerativeModel({ model: "gemini-3.6-flash" });
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    const reply = {
      role: "assistant",
      content: responseText,
      timestamp: Date.now(),
      isImage: false,
    };

    chat.messages.push(reply);
    await chat.save();

    await User.updateOne({ _id: userId }, { $inc: { credits: -1 } });

    res.status(200).json({
      success: true,
      message: "Message added successfully",
      reply,
    });
  } catch (error) {
    console.error("textMessageController error:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

// Image Generation Controller
export const imageMessageController = async (req, res) => {
  try {
    const userId = req.user._id;

    if (req.user.credits < 2) {
      return res.json({
        success: false,
        message: "You don't have enough credits to use this feature",
      });
    }

    const { prompt, chatId, isPublished } = req.body;

    const chat = await Chat.findOne({ userId, _id: chatId });
    if (!chat) {
      return res.status(404).json({ success: false, message: "Chat not found" });
    }

    if (chat.messages.length === 0) {
      chat.name = prompt.trim().slice(0, 30) + (prompt.length > 30 ? "..." : "");
    }

    // Save user message
    chat.messages.push({
      role: "user",
      content: prompt,
      timestamp: Date.now(),
      isImage: false,
    });

    // Cleaned Endpoint URL handling
    const ikEndpoint = process.env.IMAGEKIT_URL_ENDPOINT;
    const cleanPrompt = encodeURIComponent(prompt.trim());
    
    // Direct ImageKit transformation URL
    const generatedImageUrl = `${ikEndpoint.replace(/\/$/, "")}/ik-genimg-prompt-${cleanPrompt}/quickgpt/gen_${Date.now()}.png?tr=w-800,h-800`;

    const reply = {
      role: "assistant",
      content: generatedImageUrl,
      timestamp: Date.now(),
      isImage: true,
      isPublished: Boolean(isPublished),
    };

    chat.messages.push(reply);
    await chat.save();

    await User.updateOne({ _id: userId }, { $inc: { credits: -2 } });

    return res.json({ success: true, reply });
  } catch (error) {
    console.error("imageMessageController error:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
};