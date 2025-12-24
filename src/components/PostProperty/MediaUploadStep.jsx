// components/PostProperty/MediaUploadStep.js
import { View, Text, TouchableOpacity, Image, ScrollView } from "react-native";
import { Image as ImageIcon, Video, Mic, X, Upload } from "lucide-react-native";
import * as ImagePicker from "expo-image-picker";

export function MediaUploadStep({
  theme,
  photos,
  setPhotos,
  videos,
  setVideos,
  voiceOver,
  setVoiceOver,
}) {
  const pickImages = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      const newPhotos = result.assets.map(asset => ({
        uri: asset.uri,
        type: "image",
        name: asset.fileName || `photo_${Date.now()}.jpg`,
      }));
      setPhotos([...photos, ...newPhotos]);
    }
  };

  const pickVideo = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      quality: 0.8,
    });

    if (!result.canceled) {
      setVideos({
        uri: result.assets[0].uri,
        type: "video",
        name: result.assets[0].fileName || `video_${Date.now()}.mp4`,
      });
    }
  };

  const pickAudio = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Audio,
    });

    if (!result.canceled) {
      setVoiceOver({
        uri: result.assets[0].uri,
        type: "audio",
        name: result.assets[0].fileName || `audio_${Date.now()}.m4a`,
      });
    }
  };

  const removePhoto = (index) => {
    const updated = [...photos];
    updated.splice(index, 1);
    setPhotos(updated);
  };

  const removeVideo = () => {
    setVideos(null);
  };

  const removeVoiceOver = () => {
    setVoiceOver(null);
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <Text
        style={{
          fontSize: 20,
          fontFamily: "Poppins_600SemiBold",
          color: theme.colors.text,
          marginBottom: 20,
        }}
      >
        Photos, Videos & Voice-over
      </Text>

      {/* Photos */}
      <View style={{ marginBottom: 24 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 12 }}>
          <Text
            style={{
              fontSize: 14,
              fontFamily: "Poppins_500Medium",
              color: theme.colors.text,
            }}
          >
            Photos (Recommended)
          </Text>
          <Text
            style={{
              fontSize: 12,
              fontFamily: "Poppins_400Regular",
              color: theme.colors.textSecondary,
            }}
          >
            {photos.length} uploaded
          </Text>
        </View>

        <TouchableOpacity
          onPress={pickImages}
          style={{
            backgroundColor: theme.colors.surface,
            borderRadius: 12,
            borderWidth: 2,
            borderStyle: "dashed",
            borderColor: theme.colors.border,
            padding: 40,
            alignItems: "center",
            marginBottom: 16,
          }}
          activeOpacity={0.7}
        >
          <ImageIcon size={48} color={theme.colors.primary} strokeWidth={1.5} />
          <Text
            style={{
              fontSize: 16,
              fontFamily: "Poppins_600SemiBold",
              color: theme.colors.text,
              marginTop: 12,
            }}
          >
            Upload Photos
          </Text>
          <Text
            style={{
              fontSize: 13,
              fontFamily: "Poppins_400Regular",
              color: theme.colors.textSecondary,
              marginTop: 4,
              textAlign: "center",
            }}
          >
            Add multiple photos of your property
          </Text>
        </TouchableOpacity>

        {photos.length > 0 && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 8 }}>
            <View style={{ flexDirection: "row", gap: 8 }}>
              {photos.map((photo, index) => (
                <View key={index} style={{ position: "relative" }}>
                  <Image
                    source={{ uri: photo.uri }}
                    style={{
                      width: 100,
                      height: 100,
                      borderRadius: 8,
                      backgroundColor: theme.colors.border,
                    }}
                  />
                  <TouchableOpacity
                    onPress={() => removePhoto(index)}
                    style={{
                      position: "absolute",
                      top: 4,
                      right: 4,
                      backgroundColor: theme.colors.error,
                      borderRadius: 12,
                      padding: 4,
                    }}
                  >
                    <X size={12} color="#FFFFFF" />
                  </TouchableOpacity>
                  <View
                    style={{
                      position: "absolute",
                      bottom: 4,
                      left: 4,
                      backgroundColor: "rgba(0,0,0,0.6)",
                      paddingHorizontal: 6,
                      paddingVertical: 2,
                      borderRadius: 4,
                    }}
                  >
                    <Text style={{ fontSize: 10, color: "#FFFFFF", fontFamily: "Poppins_400Regular" }}>
                      vmrdaplots.com
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </ScrollView>
        )}
      </View>

      {/* Videos */}
      <View style={{ marginBottom: 24 }}>
        <Text
          style={{
            fontSize: 14,
            fontFamily: "Poppins_500Medium",
            color: theme.colors.text,
            marginBottom: 12,
          }}
        >
          Videos (Optional)
        </Text>

        <TouchableOpacity
          onPress={pickVideo}
          style={{
            backgroundColor: theme.colors.surface,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: theme.colors.border,
            padding: 16,
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 12,
          }}
          activeOpacity={0.7}
        >
          <Video size={24} color={theme.colors.primary} strokeWidth={1.5} />
          <Text
            style={{
              fontSize: 14,
              fontFamily: "Poppins_500Medium",
              color: theme.colors.text,
              marginLeft: 12,
            }}
          >
            Upload Video
          </Text>
        </TouchableOpacity>

        {videos && (
          <View style={{ position: "relative", marginBottom: 12 }}>
            <View
              style={{
                backgroundColor: theme.colors.border,
                borderRadius: 8,
                padding: 12,
                flexDirection: "row",
                alignItems: "center",
                gap: 12,
              }}
            >
              <Video size={20} color={theme.colors.text} />
              <Text
                style={{
                  flex: 1,
                  fontSize: 13,
                  fontFamily: "Poppins_400Regular",
                  color: theme.colors.text,
                }}
              >
                {videos.name || "Video file"}
              </Text>
              <TouchableOpacity onPress={removeVideo}>
                <X size={18} color={theme.colors.error} />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>

      {/* Voice-over */}
      <View style={{ marginBottom: 24 }}>
        <Text
          style={{
            fontSize: 14,
            fontFamily: "Poppins_500Medium",
            color: theme.colors.text,
            marginBottom: 12,
          }}
        >
          Voice-over (Optional)
        </Text>

        <TouchableOpacity
          onPress={pickAudio}
          style={{
            backgroundColor: theme.colors.surface,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: theme.colors.border,
            padding: 16,
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 12,
          }}
          activeOpacity={0.7}
        >
          <Mic size={24} color={theme.colors.primary} strokeWidth={1.5} />
          <Text
            style={{
              fontSize: 14,
              fontFamily: "Poppins_500Medium",
              color: theme.colors.text,
              marginLeft: 12,
            }}
          >
            Upload Voice-over
          </Text>
        </TouchableOpacity>

        {voiceOver && (
          <View style={{ position: "relative" }}>
            <View
              style={{
                backgroundColor: theme.colors.border,
                borderRadius: 8,
                padding: 12,
                flexDirection: "row",
                alignItems: "center",
                gap: 12,
              }}
            >
              <Mic size={20} color={theme.colors.text} />
              <Text
                style={{
                  flex: 1,
                  fontSize: 13,
                  fontFamily: "Poppins_400Regular",
                  color: theme.colors.text,
                }}
              >
                {voiceOver.name || "Audio file"}
              </Text>
              <TouchableOpacity onPress={removeVoiceOver}>
                <X size={18} color={theme.colors.error} />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>

      {/* Info Box */}
      <View
        style={{
          backgroundColor: theme.colors.surfaceElevated,
          borderRadius: 12,
          padding: 16,
          marginTop: 8,
        }}
      >
        <Text
          style={{
            fontSize: 12,
            fontFamily: "Poppins_400Regular",
            color: theme.colors.textSecondary,
            textAlign: "center",
          }}
        >
          • Photos will be watermarked automatically
          {"\n"}• Upload clear images for better visibility
          {"\n"}• Videos and voice-over are optional
        </Text>
      </View>
    </ScrollView>
  );
}