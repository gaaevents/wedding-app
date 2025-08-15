import { supabase } from './supabase';
import { Database } from '../types/database';

type Message = Database['public']['Tables']['messages']['Row'];
type MessageInsert = Database['public']['Tables']['messages']['Insert'];

// Get messages between two users
export const getConversation = async (receiverId: string, eventId?: string) => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }

  let query = supabase
    .from('messages')
    .select(`
      *,
      sender:users!messages_sender_id_fkey(name, email),
      receiver:users!messages_receiver_id_fkey(name, email)
    `)
    .or(`and(sender_id.eq.${user.id},receiver_id.eq.${receiverId}),and(sender_id.eq.${receiverId},receiver_id.eq.${user.id})`)
    .order('created_at', { ascending: true });

  if (eventId) {
    query = query.eq('event_id', eventId);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching conversation:', error);
    throw error;
  }

  return data;
};

// Get all conversations for current user
export const getUserConversations = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }

  const { data, error } = await supabase
    .from('messages')
    .select(`
      *,
      sender:users!messages_sender_id_fkey(name, email),
      receiver:users!messages_receiver_id_fkey(name, email),
      events(title, date)
    `)
    .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching conversations:', error);
    throw error;
  }

  // Group messages by conversation
  const conversations = new Map();
  
  data.forEach(message => {
    const otherUserId = message.sender_id === user.id ? message.receiver_id : message.sender_id;
    const otherUser = message.sender_id === user.id ? message.receiver : message.sender;
    
    const key = `${otherUserId}-${message.event_id || 'general'}`;
    
    if (!conversations.has(key)) {
      conversations.set(key, {
        otherUser,
        eventId: message.event_id,
        event: message.events,
        lastMessage: message,
        unreadCount: 0,
        messages: []
      });
    }
    
    const conversation = conversations.get(key);
    conversation.messages.push(message);
    
    // Count unread messages
    if (message.receiver_id === user.id && !message.is_read) {
      conversation.unreadCount++;
    }
    
    // Update last message if this one is newer
    if (new Date(message.created_at) > new Date(conversation.lastMessage.created_at)) {
      conversation.lastMessage = message;
    }
  });

  return Array.from(conversations.values()).sort((a, b) => 
    new Date(b.lastMessage.created_at).getTime() - new Date(a.lastMessage.created_at).getTime()
  );
};

// Send a message
export const sendMessage = async (messageData: Omit<MessageInsert, 'id' | 'sender_id' | 'created_at'>) => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }

  const { data, error } = await supabase
    .from('messages')
    .insert([
      {
        ...messageData,
        sender_id: user.id
      }
    ])
    .select(`
      *,
      sender:users!messages_sender_id_fkey(name, email),
      receiver:users!messages_receiver_id_fkey(name, email)
    `)
    .single();

  if (error) {
    console.error('Error sending message:', error);
    throw error;
  }

  return data;
};

// Mark messages as read
export const markMessagesAsRead = async (senderId: string, eventId?: string) => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }

  let query = supabase
    .from('messages')
    .update({ is_read: true })
    .eq('receiver_id', user.id)
    .eq('sender_id', senderId)
    .eq('is_read', false);

  if (eventId) {
    query = query.eq('event_id', eventId);
  }

  const { error } = await query;

  if (error) {
    console.error('Error marking messages as read:', error);
    throw error;
  }

  return true;
};

// Get unread message count
export const getUnreadMessageCount = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }

  const { count, error } = await supabase
    .from('messages')
    .select('*', { count: 'exact', head: true })
    .eq('receiver_id', user.id)
    .eq('is_read', false);

  if (error) {
    console.error('Error fetching unread count:', error);
    throw error;
  }

  return count || 0;
};

// Delete a message
export const deleteMessage = async (messageId: string) => {
  const { error } = await supabase
    .from('messages')
    .delete()
    .eq('id', messageId);

  if (error) {
    console.error('Error deleting message:', error);
    throw error;
  }

  return true;
};

// Search messages
export const searchMessages = async (searchTerm: string, eventId?: string) => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }

  let query = supabase
    .from('messages')
    .select(`
      *,
      sender:users!messages_sender_id_fkey(name, email),
      receiver:users!messages_receiver_id_fkey(name, email),
      events(title)
    `)
    .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
    .ilike('content', `%${searchTerm}%`)
    .order('created_at', { ascending: false });

  if (eventId) {
    query = query.eq('event_id', eventId);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error searching messages:', error);
    throw error;
  }

  return data;
};