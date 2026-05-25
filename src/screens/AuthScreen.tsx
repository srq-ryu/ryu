import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
} from 'react-native';
import { supabase } from '../services/supabaseClient';
import { useSelector } from "react-redux";
import type { RootState } from "../store";
import { appTheme } from "../theme";

export function AuthScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [message, setMessage] = useState<{ type: 'error' | 'success', text: string } | null>(null);
  
  const themeMode = useSelector((s: RootState) => s.theme.mode);
  const { colors } = appTheme(themeMode);
  const dynamicStyles = styles(colors);

  async function handleAuth() {
    if (!email || !password) {
      setMessage({ type: 'error', text: '请输入邮箱和密码' });
      return;
    }

    setMessage(null);
    setLoading(true);
    console.log(`尝试${isSignUp ? '注册' : '登录'}: ${email}`);

    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });
        
        if (error) throw error;
        
        if (data.user && data.session) {
          setMessage({ type: 'success', text: '注册并登录成功！' });
        } else {
          setMessage({ type: 'success', text: '注册成功！请查收邮件并点击确认链接。确认后即可登录。' });
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      }
    } catch (error: any) {
      console.error('Auth Error:', error.message);
      setMessage({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={dynamicStyles.container}
    >
      <ScrollView contentContainerStyle={dynamicStyles.scrollContent}>
        <View style={dynamicStyles.card}>
          <Text style={dynamicStyles.title}>{isSignUp ? '加入心园' : '欢迎回来'}</Text>
          <Text style={dynamicStyles.subtitle}>
            {isSignUp ? '开启你的心灵疗愈之旅' : '继续探索你的内心世界'}
          </Text>

          {message && (
            <View style={[dynamicStyles.messageBox, message.type === 'error' ? dynamicStyles.errorBox : dynamicStyles.successBox]}>
              <Text style={dynamicStyles.messageText}>{message.text}</Text>
            </View>
          )}

          <View style={dynamicStyles.inputContainer}>
            <TextInput
              style={dynamicStyles.input}
              placeholder="邮箱"
              placeholderTextColor={colors.textMuted}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
            <TextInput
              style={dynamicStyles.input}
              placeholder="密码"
              placeholderTextColor={colors.textMuted}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <TouchableOpacity
            style={[dynamicStyles.button, loading && dynamicStyles.buttonDisabled]}
            onPress={handleAuth}
            disabled={loading}
          >
            <Text style={dynamicStyles.buttonText}>
              {loading ? '处理中...' : isSignUp ? '立即注册' : '登录'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              setIsSignUp(!isSignUp);
              setMessage(null);
            }}
            style={dynamicStyles.switchContainer}
          >
            <Text style={dynamicStyles.switchText}>
              {isSignUp ? '已有账号？登录' : '没有账号？立即注册'}
            </Text>
          </TouchableOpacity>

          {isSignUp && (
            <View style={dynamicStyles.tipContainer}>
              <Text style={dynamicStyles.tipTitle}>💡 开发小贴士</Text>
              <Text style={dynamicStyles.tipText}>
                如果注册后无法直接进入应用，通常是因为 Supabase 开启了邮箱验证。
              </Text>
              <Text style={dynamicStyles.tipText}>
                你可以：
                1. 检查收件箱确认邮件
                2. 或在 Supabase 控制台的 Authentication {'>'} Settings 中关闭 "Confirm email" 选项。
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 24,
    padding: 30,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.primaryGreen,
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: colors.textMuted,
    marginBottom: 24,
    textAlign: 'center',
  },
  messageBox: {
    padding: 12,
    borderRadius: 12,
    marginBottom: 20,
  },
  errorBox: {
    backgroundColor: 'rgba(255, 107, 107, 0.15)',
    borderWidth: 1,
    borderColor: '#FF6B6B',
  },
  successBox: {
    backgroundColor: 'rgba(47, 93, 70, 0.15)',
    borderWidth: 1,
    borderColor: colors.primaryGreen,
  },
  messageText: {
    fontSize: 14,
    color: colors.text,
    textAlign: 'center',
    lineHeight: 20,
  },
  inputContainer: {
    gap: 16,
    marginBottom: 24,
  },
  input: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    color: colors.text,
    fontSize: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  button: {
    backgroundColor: colors.primaryGreen,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  switchContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  switchText: {
    color: colors.primaryGreen,
    fontSize: 14,
    fontWeight: '600',
  },
  tipContainer: {
    marginTop: 30,
    padding: 16,
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tipTitle: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 8,
  },
  tipText: {
    color: colors.textMuted,
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 4,
  },
});
