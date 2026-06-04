export interface ConversationLine {
  speaker: string;
  text: string;
}

export interface Conversation {
  id: string;
  title: string;
  description: string;
  topic: string;
  lines: ConversationLine[];
}

export const conversations: Conversation[] = [
  {
    id: "nama-diri",
    title: "Memperkenalkan Diri",
    description: "Percakapan sederhana untuk memperkenalkan nama dan asal",
    topic: "Nama Diri",
    lines: [
      { speaker: "Rina", text: "Hello! My name is Rina. What is your name?" },
      { speaker: "Budi", text: "Hi Rina! My name is Budi. Nice to meet you." },
      { speaker: "Rina", text: "Nice to meet you too, Budi. How are you today?" },
      { speaker: "Budi", text: "I am fine, thank you. And you?" },
      { speaker: "Rina", text: "I am great! Where are you from?" },
      { speaker: "Budi", text: "I am from Jakarta. And you?" },
      { speaker: "Rina", text: "I am from Bandung. I am a student." },
      { speaker: "Budi", text: "Me too! I study at SMP Negeri 1." },
    ],
  },
  {
    id: "alamat",
    title: "Menanyakan Alamat",
    description: "Percakapan tentang alamat dan tempat tinggal",
    topic: "Alamat",
    lines: [
      { speaker: "Rina", text: "Excuse me, where do you live?" },
      { speaker: "Budi", text: "I live on Jalan Merdeka number 10. How about you?" },
      { speaker: "Rina", text: "I live on Jalan Mawar. It is near the market." },
      { speaker: "Budi", text: "Oh, I know that street! Is it far from school?" },
      { speaker: "Rina", text: "No, it is very close. I walk to school every day." },
      { speaker: "Budi", text: "That is nice. I take the bus to school." },
      { speaker: "Rina", text: "What is your house like?" },
      { speaker: "Budi", text: "My house is small but comfortable. It has a garden." },
    ],
  },
  {
    id: "benda-kelas",
    title: "Benda di Dalam Kelas",
    description: "Percakapan tentang benda-benda yang ada di kelas",
    topic: "Benda di Kelas",
    lines: [
      { speaker: "Rina", text: "Budi, can you help me find my pencil?" },
      { speaker: "Budi", text: "Sure! Is it on your desk?" },
      { speaker: "Rina", text: "No, I already checked. Maybe it is in my bag." },
      { speaker: "Budi", text: "Let me look. Oh, here it is! It was under your book." },
      { speaker: "Rina", text: "Thank you! Do you have an eraser?" },
      { speaker: "Budi", text: "Yes, I have two erasers. You can borrow one." },
      { speaker: "Rina", text: "Thank you so much. What is on the whiteboard?" },
      { speaker: "Budi", text: "The teacher wrote today's lesson: English vocabulary." },
    ],
  },
  {
    id: "rumah",
    title: "Di Rumah",
    description: "Percakapan tentang kegiatan dan ruangan di rumah",
    topic: "Rumah",
    lines: [
      { speaker: "Rina", text: "What do you usually do at home, Budi?" },
      { speaker: "Budi", text: "I help my mother in the kitchen. I like cooking." },
      { speaker: "Rina", text: "That is wonderful! What can you cook?" },
      { speaker: "Budi", text: "I can cook fried rice and noodles. Do you cook?" },
      { speaker: "Rina", text: "Not really. I like to read books in my bedroom." },
      { speaker: "Budi", text: "How many rooms does your house have?" },
      { speaker: "Rina", text: "We have a living room, two bedrooms, a kitchen, and a bathroom." },
      { speaker: "Budi", text: "My house is similar. I share a bedroom with my brother." },
    ],
  },
  {
    id: "warna",
    title: "Warna Kesukaan",
    description: "Percakapan tentang warna-warna dan benda berwarna",
    topic: "Warna",
    lines: [
      { speaker: "Rina", text: "Budi, what is your favorite color?" },
      { speaker: "Budi", text: "My favorite color is blue. I like the sky and the ocean." },
      { speaker: "Rina", text: "Blue is beautiful! My favorite color is green." },
      { speaker: "Budi", text: "Green reminds me of trees and grass. What is green in your house?" },
      { speaker: "Rina", text: "My bedroom walls are light green. And I have many green plants." },
      { speaker: "Budi", text: "That sounds lovely. What color is your school bag?" },
      { speaker: "Rina", text: "My school bag is red. Red is a bright color." },
      { speaker: "Budi", text: "I like red too. I have a red pencil case." },
    ],
  },
  {
    id: "hewan",
    title: "Hewan Peliharaan",
    description: "Percakapan tentang hewan peliharaan dan hewan favorit",
    topic: "Hewan",
    lines: [
      { speaker: "Rina", text: "Do you have any pets at home, Budi?" },
      { speaker: "Budi", text: "Yes, I have a cat. Her name is Kitty. She is very cute." },
      { speaker: "Rina", text: "I love cats! What color is Kitty?" },
      { speaker: "Budi", text: "Kitty is white with brown spots. Do you have a pet?" },
      { speaker: "Rina", text: "I have two birds. They can sing beautifully." },
      { speaker: "Budi", text: "Birds are lovely. What do they eat?" },
      { speaker: "Rina", text: "They eat seeds and fruits. I feed them every morning." },
      { speaker: "Budi", text: "Maybe one day I can visit and see your birds!" },
    ],
  },
  {
    id: "aktivitas",
    title: "Aktivitas Sehari-hari",
    description: "Percakapan tentang rutinitas dan kegiatan harian",
    topic: "Aktivitas Sehari-hari",
    lines: [
      { speaker: "Rina", text: "What time do you wake up every day, Budi?" },
      { speaker: "Budi", text: "I wake up at five o'clock in the morning. How about you?" },
      { speaker: "Rina", text: "I wake up at half past five. Then I take a shower." },
      { speaker: "Budi", text: "Me too. After that, I have breakfast with my family." },
      { speaker: "Rina", text: "What do you usually eat for breakfast?" },
      { speaker: "Budi", text: "I eat rice with fried egg. Sometimes I eat bread with jam." },
      { speaker: "Rina", text: "After school, I do my homework. Then I help my mother." },
      { speaker: "Budi", text: "I also do homework. Then I play with my friends outside." },
      { speaker: "Rina", text: "What time do you go to bed?" },
      { speaker: "Budi", text: "I go to bed at nine o'clock. I need rest for tomorrow." },
    ],
  },
];

export function getConversationById(id: string): Conversation | undefined {
  return conversations.find((c) => c.id === id);
}

export const conversationTopics = [...new Set(conversations.map((c) => c.topic))];
