import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';
import firebase from '../Config';

const Chat = (props) => {
  const { currentid } = props.route.params;
  const { seconditem } = props.route.params;
  const [groupData, setGroupData] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [senderNames, setSenderNames] = useState({});
  const [typingUsers, setTypingUsers] = useState({});
  const [Chatid,setChatid] = useState("")
  const setChatidentification = async () => {
    if(currentid<seconditem.id)
     setChatid(currentid+seconditem.id)
  else
     setChatid(seconditem.id+currentid)
  }
  
  useEffect(() => {
    const setChatIdAndInitializeChat = async () => {
      setChatidentification();
      await new Promise(resolve => setTimeout(resolve, 500)); 

      if (Chatid) {
        const Allgroupref = firebase.database().ref('Chats');
        const commonGroupRef = Allgroupref.child(`Chat${Chatid}`);

        const handleGroupData = (snapshot) => {
          const data = snapshot.val();
          setGroupData(data);

          if (!data) {
            commonGroupRef.set({
              members: { [currentid]: true, [seconditem.id]: true },
              messages: {},
              typing: {},
            });
          }
        };

        commonGroupRef.on('value', handleGroupData);

        return () => {
          commonGroupRef.off('value', handleGroupData);
        };
      }
    };

    setChatIdAndInitializeChat();
  }, [Chatid, currentid, seconditem.id]);

  useEffect(() => {
    if (groupData) {
      const commonGroupMessagesRef = firebase.database().ref(`Chats/Chat${Chatid}/messages`);
      const commonGroupTypingRef = firebase.database().ref(`Chats/Chat${Chatid}/typing`);

      const handleMessages = async (messagesSnapshot) => {
        const messagesData = messagesSnapshot.val();
        const messagesArray = messagesData ? Object.values(messagesData) : [];
        const senderNamesMap = {};
        for (const message of messagesArray) {
          if (!senderNames[message.sender]) {
            const senderName = await getUserNameById(message.sender);
            senderNamesMap[message.sender] = senderName;
          }
        }

        setSenderNames((prevSenderNames) => ({ ...prevSenderNames, ...senderNamesMap }));
        setMessages(messagesArray);
      };

      const handleTyping = (typingSnapshot) => {
        const typingData = typingSnapshot.val() || {};
        setTypingUsers(typingData);
      };

      commonGroupMessagesRef.on('value', handleMessages);
      commonGroupTypingRef.on('value', handleTyping);

      return () => {
        commonGroupMessagesRef.off('value', handleMessages);
        commonGroupTypingRef.off('value', handleTyping);
      };
    }
  }, [groupData]);

  const sendMessage = () => {
    if (newMessage.trim() === '') {
      return;
    }

    const commonGroupMessagesRef = firebase.database().ref(`Chats/Chat${Chatid}/messages`);
    const newMessageRef = commonGroupMessagesRef.push();

    const messageData = {
      text: newMessage,
      sender: currentid,
      timestamp: new Date().getTime(),
    };

    newMessageRef.set(messageData);

    clearTypingStatus();
    setNewMessage('');
  };

  const startTyping = () => {
    const commonGroupTypingRef = firebase.database().ref(`Chats/Chat${Chatid}/typing`);
    commonGroupTypingRef.child(currentid).set(true);
  };

  const stopTyping = () => {
    const commonGroupTypingRef = firebase.database().ref(`Chats/Chat${Chatid}/typing`);
    commonGroupTypingRef.child(currentid).remove();
  };

  const clearTypingStatus = () => {
    const commonGroupTypingRef = firebase.database().ref(`Chats/Chat${Chatid}/typing`);
    commonGroupTypingRef.child(currentid).remove();
  };

  const getUserNameById = async (profileId) => {
    try {
      const profileRef = firebase.database().ref(`profils/profil${profileId}`);
      const snapshot = await profileRef.once('value');

      if (snapshot.exists()) {
        const userProfile = snapshot.val();
        return `${userProfile.nom} ${userProfile.prenom}`;
      } else {
        return 'Unknown User';
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return 'Unknown User';
    }
  };

  return (
    <View style={styles.container}>
      {groupData ? (
        <>
          <FlatList
            data={messages}
            keyExtractor={(item) => item.timestamp.toString()}
            renderItem={({ item }) => (
              <View
                style={[
                  styles.messageContainer,
                  {
                    alignSelf: item.sender === currentid ? 'flex-end' : 'flex-start',
                    backgroundColor: item.sender === currentid ? '#C3E6F5' : '#87CEEB',
                  },
                ]}
              >
                <Text style={styles.senderText}>{senderNames[item.sender]}</Text>
                <Text style={styles.messageText}>{item.text}</Text>
                <Text style={styles.timestampText}>
                  {new Date(item.timestamp).toLocaleString()}
                </Text>
              </View>
            )}
          />
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            value={newMessage}
            onChangeText={(text) => {
              setNewMessage(text);
              if (text.trim() !== '') {
                startTyping();
              } else {
                stopTyping();
              }
            }}
            onBlur={() => stopTyping()}
          />
          <Button title="Send" onPress={sendMessage} />
          {Object.keys(typingUsers).length > 0 && !typingUsers[currentid] && (
            <Text>{`${Object.keys(typingUsers)
              .map(id => senderNames[id])
              .join(', ')} ${
              Object.keys(typingUsers).length > 1 ? 'are typing...' : 'is typing...'
            }`}</Text>
          )}
        </>
      ) : (
        <Text>Creating Chat...</Text>
      )}
    </View>
  );
  
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  messageContainer: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginBottom: 8,
    backgroundColor: '#C3E6F5',
    borderRadius: 8,
  },
  messageText: {
    fontSize: 16,
    marginBottom: 4,
  },
  senderText: {
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  timestampText: {
    color: '#888',
  },
  input: {
    height: 40,
    borderWidth: 1,
    marginBottom: 8,
    paddingHorizontal: 8,
  },
});

export default Chat;
