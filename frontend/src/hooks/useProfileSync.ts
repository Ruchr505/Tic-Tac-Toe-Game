import { useEffect, useRef } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

// Hook สำหรับ sync ชื่อจาก Auth0 ไปยัง backend ตอน login
export function useProfileSync() {
  const { isAuthenticated, user, getAccessTokenSilently } = useAuth0();
  const hasSynced = useRef(false);

  useEffect(() => {
    const syncProfile = async () => {
      if (isAuthenticated && user?.name && !hasSynced.current) {
        hasSynced.current = true;
        try {
          const token = await getAccessTokenSilently();
          const response = await fetch('/api/users/me/profile', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ name: user.name }),
          });
          
          if (response.ok) {
            console.log('Profile synced successfully:', user.name);
          } else {
            console.error('Failed to sync profile:', response.status);
          }
        } catch (error) {
          console.error('Failed to sync profile:', error);
        }
      }
    };

    syncProfile();
  }, [isAuthenticated, user?.name, getAccessTokenSilently]);
}
