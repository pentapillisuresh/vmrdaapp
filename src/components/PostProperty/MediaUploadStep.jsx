// components/PostProperty/MediaUploadStep.js
import { useState,useEffect } from "react";
import { View, Text, TouchableOpacity, Image, ScrollView } from "react-native";
import { Image as ImageIcon, Video, X } from "lucide-react-native";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import ApiService from "../ApiService";

export function MediaUploadStep({
  theme,
  photos,
  setPhotos,
  videos,
  setVideos,
}) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState({
    photos: 0,
    videos: 0,
    voice: 0,
  });
  

  
const uploadWithProgress = async (url, formData, type, setProgress, token) => {
  try {
    const res = await ApiService.post(url, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (event) => {
        const percent = Math.round((event.loaded * 100) / event.total);
        setProgress((prev) => ({ ...prev, [type]: percent }));
      },
    });
    return res.data;
  } catch (err) {
    console.error(`❌ ${type} upload failed`, err);
    return null;
  }
};

  const handleSubmit = async () => {
    setUploading(true);
    setProgress({ photos: 0, videos: 0, voice: 0 });
  
    const { token, user } = await getAuth(); // Replace with actual client data retrieval
    const clientId = user ? user?.id : null;

    let uploadedPhotoUrls = [];
    let uploadedVideoUrl = videos?.url || null;
  
    try {
      /* ---------------- PHOTOS ---------------- */
      const newPhotos = photos.filter((p) => p.isNew);
  
      if (newPhotos.length > 0) {
        const form = new FormData();
  
        newPhotos.forEach((photo) => {
          form.append("images", {
            uri: photo.uri,
            name: photo.name,
            type: "image/jpeg",
          });
        });
  
        const res = await uploadWithProgress(
          "/images/upload-multiple",
          form,
          "photos",
          setProgress,
          token
        );
  
        if (res?.images) {
          uploadedPhotoUrls = res.images.map((img) => img.url);
        }
      }
  
      const existingPhotos = photos
        .filter((p) => !p.isNew)
        .map((p) => p.url);
  
      const finalPhotos = [...existingPhotos, ...uploadedPhotoUrls];
  
      /* ---------------- VIDEO ---------------- */
      if (videos?.isNew) {
        const form = new FormData();
        form.append("video", {
          uri: videos.uri,
          name: videos.name,
          type: "video/mp4",
        });
  
        const res = await uploadWithProgress(
          "/images/uploadVideo",
          form,
          "videos",
          setProgress,
          token
        );
  
        uploadedVideoUrl = res?.url;
      }
  
      /* ---------------- FINAL PAYLOAD ---------------- */
      const finalData = {
        photos: finalPhotos,
        videos: uploadedVideoUrl,
      };
  
      console.log("✅ Final Uploaded Data:", finalData);
  
      // updateData(finalData); // same as web
      onNext();              // go to next step
    } catch (err) {
      console.error("❌ Upload error:", err);
    } finally {
      setUploading(false);
    }
  };

  const applyWatermark = async (uri) => {
    try {
      const result = await ImageManipulator.manipulateAsync(
        uri,
        [
          [{
            overlay: {
              uri: Image.resolveAssetSource(require("../../../assets/images/favicon.png")).uri,
              position: { x: 100, y: 100 }
            }
          }],
        ],
        { compress: 0.9, format: ImageManipulator.SaveFormat.JPEG }
      );

      return result.uri;
    } catch (err) {
      console.error("Watermark failed:", err);
      return uri; // fallback
    }
  };

  // --- Pick Images ---
  const pickImages = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 1,
    });

    if (!result.canceled) {
      const processedPhotos = [];
      for (const asset of result.assets) {
        const watermarkedUri = await applyWatermark(asset.uri);

        processedPhotos.push({
          uri: watermarkedUri,
          originalUri: asset.uri,
          name: asset.fileName || `photo_${Date.now()}.jpg`,
          type: "image/jpeg",
          isNew: true,
        });
      }
      setPhotos((prev) => [...prev, ...processedPhotos]);
      console.log("Photos::",photos)

    }
  };

  // --- Pick Video ---
  const pickVideo = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      quality: 1,
    });

    if (!result.canceled) {
      const asset = result.assets[0];
      setVideos({
        uri: asset.uri,
        name: asset.fileName || `video_${Date.now()}.mp4`,
        type: "video/mp4",
        isNew: true,
      });
    }
  };

  const removePhoto = (index) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const removeVideo = () => setVideos(null);

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
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {photos.map((photo, index) => (
              <View key={index} style={{ marginRight: 10 }}>
                <Image
                  source={{ uri: photo.uri }}
                  style={{
                    width: 100,
                    height: 100,
                    borderRadius: 8,
                  }}
                />

                {/* Remove */}
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
                  <X size={12} color="#fff" />
                </TouchableOpacity>

                {/* Watermark badge */}
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
                  <Text style={{ fontSize: 10, color: "#fff" }}>
                    vmrdaplots.com
                  </Text>
                </View>
              </View>
            ))}
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