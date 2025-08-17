import React, { useState, useEffect, useContext, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { getMeetingAccess } from '../api/auth';

export default function MeetingRoom() {
  const { sessionId, slotIndex } = useParams();
  const { accessToken } = useContext(AuthContext);
  const navigate = useNavigate();
  const jitsiContainerRef = useRef(null);
  const jitsiApiRef = useRef(null);

  const [meetingData, setMeetingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadMeeting = async () => {
      try {
        const meetingInfo = await getMeetingAccess(sessionId, slotIndex, accessToken);
        setMeetingData(meetingInfo);
        initializeJitsi(meetingInfo.meetingConfig);
      } catch (err) {
        console.error('❌ Error loading meeting:', err);
        setError(err.response?.data?.error || 'Failed to access meeting');
      } finally {
        setLoading(false);
      }
    };

    loadMeeting();
    return () => jitsiApiRef.current?.dispose();
  }, [sessionId, slotIndex, accessToken]);

  const initializeJitsi = (config) => {
    if (!window.JitsiMeetExternalAPI) {
      const script = document.createElement('script');
      script.src = `https://${config.domain}/external_api.js`;
      script.onload = () => createMeeting(config);
      document.head.appendChild(script);
    } else {
      createMeeting(config);
    }
  };

  const createMeeting = (config) => {
    if (!jitsiContainerRef.current) return;

    // ✅ All configuration is here in the frontend!
    jitsiApiRef.current = new window.JitsiMeetExternalAPI(config.domain, {
      roomName: config.roomName,
      width: '100%',
      height: '100%',
      parentNode: jitsiContainerRef.current,
      userInfo: config.userInfo,
      configOverwrite: {
        startWithAudioMuted: true,
        startWithVideoMuted: false,
        prejoinPageEnabled: false,
        disableModeratorIndicator: true,
        startScreenSharing: false,
        enableEmailInStats: false,
        requireDisplayName: true,
        resolution: 720,
        constraints: {
          video: {
            aspectRatio: 16 / 9,
            height: { ideal: 720, max: 1080, min: 240 },
            width: { ideal: 1280, max: 1920, min: 320 }
          }
        }
      },
      interfaceConfigOverwrite: {
        TOOLBAR_BUTTONS: [
          'microphone', 'camera', 'closedcaptions', 'desktop', 'fullscreen',
          'fodeviceselection', 'hangup', 'chat', 'raisehand',
          'videoquality', 'filmstrip', 'tileview', 'shortcuts'
        ],
        SETTINGS_SECTIONS: ['devices', 'language', 'moderator', 'profile'],
        SHOW_JITSI_WATERMARK: false,
        SHOW_WATERMARK_FOR_GUESTS: false,
        SHOW_BRAND_WATERMARK: false,
        BRAND_WATERMARK_LINK: "",
        SHOW_POWERED_BY: false,
        DEFAULT_BACKGROUND: '#474747',
        JITSI_WATERMARK_LINK: 'https://skillswap.social'
      }
    });

    jitsiApiRef.current.addEventListener('videoConferenceLeft', () => {
      navigate('/active-requests');
    });
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen"><p>Joining meeting...</p></div>;
  if (error) return <div className="flex items-center justify-center min-h-screen"><p>{error}</p></div>;

  return (
    <div className="h-screen w-screen">
      {meetingData && (
        <div className="bg-gray-800 text-white p-2 text-sm">
          {meetingData.skills.fromCurrentUser.name} ↔ {meetingData.skills.fromOtherUser.name} | With: {meetingData.participants.otherUser.name}
        </div>
      )}
      <div ref={jitsiContainerRef} className="w-full h-full" />
    </div>
  );
}