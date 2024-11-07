import { useState } from 'react';
import { StyleSheet, TextInput, FlatList, KeyboardAvoidingView, TouchableOpacity, Image, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Text } from '@/components/Themed';

// Define types for the message structure
interface Message {
  id: string;
  text: string;
  media?: string; // Media is optional
}

export default function ChatScreen() {
  // State to hold messages
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: 'Hello! How can I help you today?' },
    { id: '2', text: 'Just checking out the chat feature!' },
  ]);

  // State for input text and media URI
  const [inputText, setInputText] = useState<string>('');
  const [mediaUri, setMediaUri] = useState<string | null>(null);

  // Request permission for media picker
  const requestMediaPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission to access media library is required!');
    }
  };

  // Function to pick media (image or video)
  const pickMedia = async () => {
    await requestMediaPermission();

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      quality: 1,
      allowsEditing: true,
    });

    if (!result.canceled) {
      setMediaUri(result.assets[0].uri); // Store the picked media URI
    }
  };

  // Function to send the message
  const sendMessage = () => {
    if (inputText.trim() || mediaUri) {
      const newMessage: Message = {
        id: Date.now().toString(),
        text: inputText,
        media: mediaUri || undefined, // Include media URI if available
      };
      setMessages([...messages, newMessage]);
      setInputText(''); // Clear input text
      setMediaUri(null); // Clear media after sending
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.messageContainer}>
            <Text style={styles.messageText}>{item.text}</Text>
            {item.media && (
              <Image source={{ uri: item.media }} style={styles.mediaImage} />
            )}
          </View>
        )}
        style={styles.messageList}
      />

      <View style={styles.inputContainer}>
        <TouchableOpacity onPress={pickMedia} style={styles.mediaButton}>
          <Text style={styles.mediaButtonText}>📷</Text>
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Type a message..."
          onSubmitEditing={sendMessage}
        />
        <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  messageList: {
    flex: 1,
    padding: 10,
  },
  messageContainer: {
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    marginVertical: 5,
    alignSelf: 'flex-start',
    maxWidth: '80%',
  },
  messageText: {
    fontSize: 16,
  },
  mediaImage: {
    width: 200,
    height: 200,
    marginTop: 10,
    borderRadius: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 40,
    paddingHorizontal: 10,
    borderRadius: 20,
    borderColor: '#ddd',
    borderWidth: 1,
    backgroundColor: '#f9f9f9',
  },
  mediaButton: {
    marginRight: 8,
    backgroundColor: '#ddd',
    padding: 7,
    borderRadius: 50,
  },
  mediaButtonText: {
    fontSize: 20,
  },
  sendButton: {
    marginLeft: 8,
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});
