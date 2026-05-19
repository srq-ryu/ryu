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

export function AuthScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [message, setMessage] = useState<{ type: 'error' | 'success', text: string } | null>(null);

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
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <Text style={styles.title}>{isSignUp ? '加入心园' : '欢迎回来'}</Text>
          <Text style={styles.subtitle}>
            {isSignUp ? '开启你的心灵疗愈之旅' : '继续探索你的内心世界'}
          </Text>

          {message && (
            <View style={[styles.messageBox, message.type === 'error' ? styles.errorBox : styles.successBox]}>
              <Text style={styles.messageText}>{message.text}</Text>
            </View>
          )}

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="邮箱"
              placeholderTextColor="#8A978A"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
            <TextInput
              style={styles.input}
              placeholder="密码"
              placeholderTextColor="#8A978A"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleAuth}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? '处理中...' : isSignUp ? '立即注册' : '登录'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              setIsSignUp(!isSignUp);
              setMessage(null);
            }}
            style={styles.switchContainer}
          >
            <Text style={styles.switchText}>
              {isSignUp ? '已有账号？登录' : '没有账号？立即注册'}
            </Text>
          </TouchableOpacity>

          {isSignUp && (
            <View style={styles.tipContainer}>
              <Text style={styles.tipTitle}>💡 开发小贴士</Text>
              <Text style={styles.tipText}>
                如果注册后无法直接进入应用，通常是因为 Supabase 开启了邮箱验证。
              </Text>
              <Text style={styles.tipText}>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0E1318',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: '#1A222C',
    borderRadius: 24,
    padding: 30,
    borderWidth: 1,
    borderColor: '#2A323C',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#8A978A',
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
    borderColor: '#2F5D46',
  },
  messageText: {
    fontSize: 14,
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 20,
  },
  inputContainer: {
    gap: 16,
    marginBottom: 24,
  },
  input: {
    backgroundColor: '#2A323C',
    borderRadius: 12,
    padding: 16,
    color: '#FFFFFF',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#3A4654',
  },
  button: {
    backgroundColor: '#2F5D46',
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
    color: '#AEC2B0',
    fontSize: 14,
  },
  tipContainer: {
    marginTop: 30,
    padding: 16,
    backgroundColor: '#0E1318',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2A323C',
  },
  tipTitle: {
    color: '#F3D4C5',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 8,
  },
  tipText: {
    color: '#8A978A',
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 4,
  },
});
