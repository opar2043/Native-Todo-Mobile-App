import { View, Text, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { useTheme } from '../shared/theme'

type Lang = 'en' | 'bn';

interface RuleItem {
  title: string;
  desc: string;
}

interface RuleSection {
  title: { en: string; bn: string };
  icon: 'shield-checkmark' | 'time' | 'water' | 'barbell' | 'alert-circle';
  iconColor: string;
  items: { en: RuleItem[]; bn: RuleItem[] };
}

const RULES: RuleSection[] = [
  {
    title: {
      en: 'Conditions of Prayer',
      bn: 'নামাজের শর্তসমূহ',
    },
    icon: 'shield-checkmark',
    iconColor: '#10B981',
    items: {
      en: [
        { title: 'Being a Muslim and mature', desc: 'Must be Muslim and have reached maturity (baligh).' },
        { title: 'Purification', desc: 'Clean from major & minor impurities (wudu / ghusl).' },
        { title: 'Clean clothing & awrah', desc: 'Clothes and body must be clean and properly covered.' },
        { title: 'Face the Qibla', desc: 'Pray facing the Kaaba in Makkah.' },
        { title: 'Correct time', desc: 'Pray each prayer within its prescribed time.' },
        { title: 'Niyyah (intention)', desc: 'Have a sincere intention to perform the prayer.' },
      ],
      bn: [
        { title: 'মুসলিম ও প্রাপ্তবয়স্ক হওয়া', desc: 'মুসলিম হতে হবে এবং বালেগ (সাবালক) হতে হবে।' },
        { title: 'পবিত্রতা অর্জন', desc: 'বড় ও ছোট অপবিত্রতা থেকে পবিত্রতা (অজু / গোসল)।' },
        { title: 'পোশাক ও সতর', desc: 'জামা-কাপড় ও শরীর পবিত্র এবং সতর (আওরাহ) আবৃত থাকতে হবে।' },
        { title: 'কিবলামুখী হওয়া', desc: 'মক্কার কাবামুখী হয়ে নামাজ পড়তে হবে।' },
        { title: 'সঠিক সময়', desc: 'প্রতিটি নামাজ তার নির্ধারিত সময়ে আদায় করতে হবে।' },
        { title: 'নিয়ত করা', desc: 'নামাজ আদায়ের আন্তরিক নিয়ত থাকতে হবে।' },
      ],
    },
  },
  {
    title: {
      en: 'The Five Daily Prayers',
      bn: 'পাঁচ ওয়াক্ত নামাজ',
    },
    icon: 'time',
    iconColor: '#8B5CF6',
    items: {
      en: [
        { title: 'Fajr', desc: '2 rakat — before sunrise.' },
        { title: 'Dhuhr', desc: '4 rakat — after noon.' },
        { title: 'Asr', desc: '4 rakat — afternoon.' },
        { title: 'Maghrib', desc: '3 rakat — just after sunset.' },
        { title: 'Isha', desc: '4 rakat — at night.' },
      ],
      bn: [
        { title: 'ফজর', desc: '২ রাকাত — সূর্যোদয়ের আগে।' },
        { title: 'যোহর', desc: '৪ রাকাত — দুপুরের পর।' },
        { title: 'আসর', desc: '৪ রাকাত — বিকালে।' },
        { title: 'মাগরিব', desc: '৩ রাকাত — সূর্যাস্তের ঠিক পরে।' },
        { title: 'এশা', desc: '৪ রাকাত — রাতে।' },
      ],
    },
  },
  {
    title: {
      en: 'Wudu (Ablution) Steps',
      bn: 'অজু করার নিয়ম',
    },
    icon: 'water',
    iconColor: '#3B82F6',
    items: {
      en: [
        { title: 'Niyyah', desc: 'Make the intention to perform wudu.' },
        { title: 'Wash hands', desc: 'Wash both hands up to the wrists three times.' },
        { title: 'Rinse mouth & nose', desc: 'Rinse the mouth and clean the nose three times.' },
        { title: 'Wash face', desc: 'Wash the whole face three times.' },
        { title: 'Wash arms', desc: 'Wash right then left arm up to the elbow three times.' },
        { title: 'Wipe head & ears', desc: 'Wipe the head once and the inner ears.' },
        { title: 'Wash feet', desc: 'Wash right then left foot up to the ankles three times.' },
      ],
      bn: [
        { title: 'নিয়ত', desc: 'অজু করার নিয়ত করা।' },
        { title: 'হাত ধোয়া', desc: 'কবজি পর্যন্ত উভয় হাত তিনবার ধোয়া।' },
        { title: 'কুলি ও নাকে পানি', desc: 'তিনবার কুলি করা এবং নাকে পানি দেওয়া।' },
        { title: 'মুখমণ্ডল ধোয়া', desc: 'তিনবার পুরো মুখমণ্ডল ধোয়া।' },
        { title: 'কনুই পর্যন্ত হাত ধোয়া', desc: 'ডান তারপর বাম হাত কনুই পর্যন্ত তিনবার ধোয়া।' },
        { title: 'মাথা ও কান মাসেহ', desc: 'একবার মাথা ও কানের ভেতর মাসেহ করা।' },
        { title: 'পা ধোয়া', desc: 'ডান তারপর বাম পা গোড়ালিসহ তিনবার ধোয়া।' },
      ],
    },
  },
  {
    title: {
      en: 'Inside the Prayer (Each Rakah)',
      bn: 'নামাজের ভেতরের কাজ (প্রতি রাকাত)',
    },
    icon: 'barbell',
    iconColor: '#F59E0B',
    items: {
      en: [
        { title: 'Qiyam', desc: 'Stand, raise hands, say Allahu Akbar and recite Al-Fatihah.' },
        { title: 'Ruku', desc: 'Bow down with back straight and praise Allah.' },
        { title: 'Qawmah', desc: 'Stand upright again after bowing.' },
        { title: 'Sujud', desc: 'Prostrate with forehead and nose on the ground — two prostrations.' },
        { title: 'Jalsah', desc: 'Sit between the two prostrations.' },
        { title: 'Tashahhud', desc: 'Sit and recite the declaration of faith in the 2nd & final rakah.' },
        { title: 'Salam', desc: 'End by turning right then left saying As-salamu alaikum.' },
      ],
      bn: [
        { title: 'কিয়াম', desc: 'দাঁড়িয়ে হাত তুলে "আল্লাহু আকবার" বলে তাকবির ও সূরা ফাতিহা পড়া।' },
        { title: 'রুকু', desc: 'পিঠ সোজা রেখে নত হয়ে রুকুর তাসবীহ পড়া।' },
        { title: 'কাওমাহ', desc: 'রুকু থেকে সোজা হয়ে দাঁড়ানো।' },
        { title: 'সিজদা', desc: 'কপাল ও নাক মাটিতে লাগিয়ে দুটি সিজদা করা।' },
        { title: 'জালসাহ', desc: 'দুই সিজদার মাঝে বসা।' },
        { title: 'তাশাহহুদ', desc: 'দ্বিতীয় ও শেষ রাকাতে বসে তাশাহহুদ পড়া।' },
        { title: 'সালাম', desc: 'ডানে তারপর বামে সালাম ফিরিয়ে নামাজ শেষ করা।' },
      ],
    },
  },
  {
    title: {
      en: 'Things That Invalidate Prayer',
      bn: 'নামাজ ভঙ্গকারী বিষয়সমূহ',
    },
    icon: 'alert-circle',
    iconColor: '#EF4444',
    items: {
      en: [
        { title: 'Speaking', desc: 'Talking intentionally during the prayer.' },
        { title: 'Eating or drinking', desc: 'Eating or drinking during the prayer.' },
        { title: 'Laughing loudly', desc: 'Laughing out loud.' },
        { title: 'Uncovering awrah', desc: 'Exposing the awrah intentionally.' },
        { title: 'Losing wudu', desc: 'Passing wind, urine or stool breaks wudu.' },
        { title: 'Excessive turning', desc: 'Turning away excessively from the Qibla.' },
      ],
      bn: [
        { title: 'কথা বলা', desc: 'নামাজে ইচ্ছাকৃতভাবে কথা বলা।' },
        { title: 'খাওয়া-দাওয়া', desc: 'নামাজের মধ্যে খাওয়া বা পান করা।' },
        { title: 'উচ্চস্বরে হাসা', desc: 'অট্টহাসি দেওয়া।' },
        { title: 'সতর খোলা', desc: 'ইচ্ছাকৃতভাবে সতর (আওরাহ) খোলা।' },
        { title: 'অজু নষ্ট হওয়া', desc: 'বাতাস বের হওয়া, প্রস্রাব-পায়খানা ইত্যাদি।' },
        { title: 'অতিরিক্ত বিমুখ হওয়া', desc: 'কিবলা থেকে অতিরিক্ত অন্য দিকে মুখ করা।' },
      ],
    },
  },
];

export default function NamazRules() {
  const [lang, setLang] = useState<Lang>('en');
  const { colors, isDark } = useTheme();

  const primaryText = isDark ? 'text-white' : 'text-primaryText';
  const secondaryText = isDark ? 'text-[#A1A1AA]' : 'text-secondaryText';
  const card = isDark ? 'bg-[#1C1C23]' : 'bg-card';
  const border = isDark ? 'border-[#2A2A32]' : 'border-gray-100';
  const activeChip = isDark ? 'bg-[#26262E]' : 'bg-background';

  return (
    <View>
      {/* Language Toggle */}
      <View className={`flex-row ${card} rounded-[14px] p-1 border ${border} shadow-sm mb-6`}>
        <TouchableOpacity
          onPress={() => setLang('en')}
          className={`flex-1 py-2.5 rounded-[10px] items-center ${lang === 'en' ? activeChip : ''}`}
        >
          <Text className={`font-bold text-[14px] ${lang === 'en' ? primaryText : secondaryText}`}>English</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setLang('bn')}
          className={`flex-1 py-2.5 rounded-[10px] items-center ${lang === 'bn' ? activeChip : ''}`}
        >
          <Text className={`font-bold text-[14px] ${lang === 'bn' ? primaryText : secondaryText}`}>বাংলা</Text>
        </TouchableOpacity>
      </View>

      <Text className={`text-[12px] font-semibold uppercase tracking-widest ${secondaryText} mb-4 text-center`}>
        {lang === 'en' ? 'Namaz Rules & Guide' : 'নামাজের নিয়ম ও গাইড'}
      </Text>

      {RULES.map((section, idx) => (
        <View key={idx} className="mb-6">
          {/* Section header */}
          <View className="flex-row items-center mb-3 px-1">
            <View
              className="w-11 h-11 rounded-full items-center justify-center mr-3"
              style={{ backgroundColor: `${section.iconColor}1A` }}
            >
              <Ionicons name={section.icon} size={20} color={section.iconColor} />
            </View>
            <View className="flex-1">
              <Text className={`text-[16px] font-bold ${primaryText}`}>
                {section.title[lang]}
              </Text>
            </View>
            <View
              className="h-6 min-w-6 px-1.5 rounded-full items-center justify-center"
              style={{ backgroundColor: section.iconColor }}
            >
              <Text className="text-white font-bold text-[11px]">{section.items[lang].length}</Text>
            </View>
          </View>

          {/* Cards */}
          {section.items[lang].map((item, i) => (
            <View
              key={i}
              className={`${card} rounded-[16px] ${border} shadow-sm px-4 py-3.5 mb-2.5 flex-row items-start`}
            >
              <View
                className="w-7 h-7 rounded-full items-center justify-center mr-3 mt-0.5"
                style={{ backgroundColor: isDark ? '#26262E' : '#EFEFEF' }}
              >
                <Text className="font-bold text-[12px]" style={{ color: section.iconColor }}>
                  {lang === 'en' ? i + 1 : ['১', '২', '৩', '৪', '৫', '৬', '৭'][i] || i + 1}
                </Text>
              </View>
              <View className="flex-1">
                <Text className={`text-[14px] font-bold ${primaryText}`}>{item.title}</Text>
                <Text className={`text-[13px] mt-0.5 leading-5 ${secondaryText}`}>{item.desc}</Text>
              </View>
            </View>
          ))}
        </View>
      ))}

      {/* Footer note */}
      <View className={`${card} rounded-[16px] ${border} p-4 flex-row items-center shadow-sm mb-4`}>
        <Ionicons name="book-outline" size={18} color={colors.accent} style={{ marginRight: 10 }} />
        <Text className={`text-[13px] leading-5 flex-1 ${secondaryText}`}>
          {lang === 'en'
            ? 'Always perform namaz on time with humility and focus (khushu).'
            : 'নামাজ সর্বদা সময়মতো, বিনয় ও একাগ্রতা (খুশু) সহকারে আদায় করুন।'}
        </Text>
      </View>
    </View>
  );
}