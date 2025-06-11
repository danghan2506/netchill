import React from 'react';
import { View, ActivityIndicator, Modal, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Text } from 'react-native';

// Supported confirmation types
export type ConfirmationType = 
  // Download related
  | 'download' | 'cancel' | 'delete' | 'retry'
  // Auth related 
  | 'logout' | 'delete-account'
  // General actions
  | 'confirm' | 'destructive' | 'info' | 'warning' | 'success';

// Configuration interface
interface ConfirmationConfig {
  icon: string;
  title: string;
  message: string;
  confirmText: string;
  confirmColor: string;
  iconColor: string;
}

interface ConfirmationModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  type: ConfirmationType;
  title?: string;
  message?: string;
  confirmText?: string;
  isLoading?: boolean;
  customConfig?: Partial<ConfirmationConfig>;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  visible,
  onClose,
  onConfirm,
  type,
  title = '',
  message = '',
  confirmText,
  isLoading = false,
  customConfig = {}
}) => {
  const getModalConfig = (): ConfirmationConfig => {
    const defaultConfigs: Record<ConfirmationType, ConfirmationConfig> = {
      download: {
        icon: 'download-outline',
        title: 'Xác nhận tải xuống',
        message: `Bạn có muốn tải xuống "${title}" không?`,
        confirmText: 'Tải xuống',
        confirmColor: '#38ef7d',
        iconColor: '#38ef7d'
      },
      cancel: {
        icon: 'close-circle-outline',
        title: 'Hủy tải xuống',
        message: `Bạn có chắc chắn muốn hủy tải xuống "${title}" không?`,
        confirmText: 'Hủy',
        confirmColor: '#ff6b6b',
        iconColor: '#ff6b6b'
      },
      delete: {
        icon: 'trash-outline',
        title: 'Xóa',
        message: `Bạn có chắc chắn muốn xóa "${title}" không?`,
        confirmText: 'Xóa',
        confirmColor: '#ff6b6b',
        iconColor: '#ff6b6b'
      },
      retry: {
        icon: 'refresh-outline',
        title: 'Thử lại',
        message: 'Thao tác đã thất bại. Bạn có muốn thử lại không?',
        confirmText: 'Thử lại',
        confirmColor: '#3F5EFB',
        iconColor: '#3F5EFB'
      },
      logout: {
        icon: 'log-out-outline',
        title: 'Đăng xuất',
        message: 'Bạn có chắc chắn muốn đăng xuất không?',
        confirmText: 'Đăng xuất',
        confirmColor: '#F43F5E',
        iconColor: '#F43F5E'
      },
      'delete-account': {
        icon: 'person-remove-outline',
        title: 'Xóa tài khoản',
        message: 'Bạn có chắc chắn muốn xóa tài khoản? Hành động này không thể khôi phục.',
        confirmText: 'Xóa tài khoản',
        confirmColor: '#F43F5E',
        iconColor: '#F43F5E'
      },
      confirm: {
        icon: 'checkmark-circle-outline',
        title: 'Xác nhận',
        message: 'Bạn có chắc chắn muốn thực hiện hành động này không?',
        confirmText: 'Xác nhận',
        confirmColor: '#3F5EFB',
        iconColor: '#3F5EFB'
      },
      destructive: {
        icon: 'alert-circle-outline',
        title: 'Cảnh báo',
        message: 'Hành động này không thể khôi phục. Bạn có chắc chắn muốn tiếp tục?',
        confirmText: 'Tiếp tục',
        confirmColor: '#F43F5E',
        iconColor: '#F43F5E'
      },
      info: {
        icon: 'information-circle-outline',
        title: 'Thông tin',
        message: 'Bạn muốn tiếp tục thực hiện hành động này?',
        confirmText: 'Tiếp tục',
        confirmColor: '#3B82F6',
        iconColor: '#3B82F6'
      },
      warning: {
        icon: 'warning-outline',
        title: 'Cảnh báo',
        message: 'Bạn nên cân nhắc trước khi tiếp tục. Bạn có muốn tiếp tục không?',
        confirmText: 'Tiếp tục',
        confirmColor: '#FBBF24',
        iconColor: '#FBBF24'
      },
      success: {
        icon: 'checkmark-circle-outline',
        title: 'Thành công',
        message: 'Hành động đã thành công!',
        confirmText: 'Đóng',
        confirmColor: '#10B981',
        iconColor: '#10B981'
      }
    };

    const defaultConfig = defaultConfigs[type];
    
    if (message) defaultConfig.message = message;
    if (confirmText) defaultConfig.confirmText = confirmText;

    return {
      ...defaultConfig,
      ...customConfig
    };
  };

  const config = getModalConfig();

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />
        <BlurView intensity={25} tint="dark" style={styles.blurView}>
          <LinearGradient
            colors={['rgba(18,18,24,0.97)', 'rgba(10,10,14,0.98)']}
            style={styles.modalContent}
          >
            <View style={styles.iconContainer}>
              <Ionicons name={config.icon as any} size={24} color={config.iconColor} />
            </View>

            <Text style={styles.title}>{config.title}</Text>
            <Text style={styles.message}>{config.message}</Text>

            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                style={[styles.button, styles.cancelButton]} 
                onPress={onClose}
                disabled={isLoading}
              >
                <Text style={styles.cancelButtonText}>Hủy</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.confirmButton, { backgroundColor: config.confirmColor }]}
                onPress={onConfirm}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.confirmButtonText}>{config.confirmText}</Text>
                )}
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </BlurView>
      </View>
    </Modal>
  );
};

const styles = {
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  blurView: {
    width: '90%',
    maxWidth: 340,
    borderRadius: 12,
    overflow: 'hidden',
  },
  modalContent: {
    padding: 20,
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    gap: 12,
  },
  button: {
    flex: 1,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  confirmButton: {
    backgroundColor: '#3F5EFB',
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
} as const;

export default ConfirmationModal;