import React, { useEffect, useState } from "react";
import {View,Text,StyleSheet,ScrollView,Image,TouchableOpacity,ActivityIndicator,FlatList,TextInput,Share,Linking} from "react-native";
import { router,useLocalSearchParams, useFocusEffect } from "expo-router";
import * as Clipboard from "expo-clipboard";
import { Ionicons, Feather, FontAwesome } from "@expo/vector-icons";
import ApiService from "../components/ApiService";
import { getAuth } from "../utils/auth/auth";

export default function BlogDetailScreen() {
  const { id } = useLocalSearchParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [copied, setCopied] = useState(false);

  const shareUrl = `https://yourdomain.com/blog/${id}`;

  const stripHtml = (html) => {
    if (!html) return "";
    return html.replace(/<[^>]+>/g, "");
  };

  const getExcerpt = (html, max = 120) => {
    const text = stripHtml(html);
    return text.length > max ? text.slice(0, max) + "..." : text;
  };

  const calculateReadTime = (html) => {
    const words = stripHtml(html).split(/\s+/).length;
    return `${Math.ceil(words / 200)} min read`;
  };

  const fetchBlog = async () => {
    const { token, user } = await getAuth(); // Replace with actual client data retrieval
    const clientId = user ? user?.id : null;

    try {
      setLoading(true);
      const res = await ApiService.get(`/blogs/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setBlog(res.blog);

      const all = await ApiService.get("/blogs", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setRelatedBlogs(
        all.blogs.filter((b) => b.id !== res.blog.id).slice(0, 3)
      );
    } catch (e) {
      setError("Blog not found");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlog();
  }, [id]);

  const copyLink = async () => {
    await Clipboard.setStringAsync(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareNative = async () => {
    await Share.share({
      title: blog.name,
      message: `${blog.name}\n\n${getExcerpt(blog.description, 150)}\n\n${shareUrl}`,
    });
  };

  const shareExternal = (url) => Linking.openURL(url);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#f97316" />
        <Text style={styles.loading}>Loading blog post…</Text>
      </View>
    );
  }

  if (error || !blog) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorTitle}>Blog Not Found</Text>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backBtn}
        >
          <Ionicons name="arrow-back" size={18} color="#fff" />
          <Text style={styles.backText}>Back to Blogs</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <TouchableOpacity
        style={styles.nav}
        onPress={() => router.back()}
      >
        <Ionicons name="arrow-back" size={20} color="#555" />
        <Text style={styles.navText}>Back to Blogs</Text>
      </TouchableOpacity>

      {/* Title */}
      <Text style={styles.title}>{blog.name}</Text>

      {/* Meta */}
      <View style={styles.meta}>
        <Text style={styles.metaText}>
          📅 {new Date(blog.createdAt).toDateString()}
        </Text>
        <Text style={styles.metaText}>
          ⏱ {calculateReadTime(blog.description)}
        </Text>
        <Text style={styles.metaText}>👁 {blog.views || 0} views</Text>
      </View>

      {/* Image */}
      {blog.photo && (
        <Image source={{ uri: blog.photo }} style={styles.image} />
      )}

      {/* Content */}
      <Text style={styles.content}>
        {stripHtml(blog.description)}
      </Text>

      {/* Share */}
      <View style={styles.shareBox}>
        <Text style={styles.shareTitle}>Share this article</Text>

        <View style={styles.shareRow}>
          <TouchableOpacity style={styles.shareBtn} onPress={shareNative}>
            <Feather name="share-2" size={18} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.shareBtn, { backgroundColor: "#1877f2" }]}
            onPress={() =>
              shareExternal(
                `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`
              )
            }
          >
            <FontAwesome name="facebook" size={18} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.shareBtn, { backgroundColor: "#0ea5e9" }]}
            onPress={() =>
              shareExternal(
                `https://twitter.com/intent/tweet?url=${shareUrl}`
              )
            }
          >
            <FontAwesome name="twitter" size={18} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.shareBtn,
              { backgroundColor: copied ? "#16a34a" : "#374151" },
            ]}
            onPress={copyLink}
          >
            <Feather name={copied ? "check" : "link"} size={18} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Related */}
      {relatedBlogs.length > 0 && (
        <>
          <Text style={styles.relatedTitle}>Related Articles</Text>
          <FlatList
            data={relatedBlogs}
            keyExtractor={(item) => item.id.toString()}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.relatedCard}
                onPress={() => router.push({
                    pathname: "/blogDetails",
                    params: { id: item.id }
                  })}
                          >
                {item.photo && (
                  <Image
                    source={{ uri: item.photo }}
                    style={styles.relatedImage}
                  />
                )}
                <Text style={styles.relatedName} numberOfLines={2}>
                  {item.name}
                </Text>
                <Text style={styles.relatedExcerpt} numberOfLines={2}>
                  {getExcerpt(item.description, 80)}
                </Text>
              </TouchableOpacity>
            )}
          />
        </>
      )}

    </ScrollView>
  );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff", padding: 16 },
  
    center: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
  
    loading: { marginTop: 10, color: "#555" },
  
    nav: { flexDirection: "row", alignItems: "center", marginBottom: 16 },
    navText: { marginLeft: 8, color: "#555" },
  
    title: { fontSize: 28, fontWeight: "bold", marginBottom: 10 },
  
    meta: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 12 },
    metaText: { color: "#666", fontSize: 12 },
  
    image: {
      width: "100%",
      height: 240,
      borderRadius: 14,
      marginVertical: 14,
    },
  
    content: {
      fontSize: 16,
      lineHeight: 26,
      color: "#374151",
      marginBottom: 24,
    },
  
    shareBox: {
      backgroundColor: "#f9fafb",
      padding: 16,
      borderRadius: 14,
      marginBottom: 24,
    },
  
    shareTitle: { fontWeight: "bold", marginBottom: 12 },
  
    shareRow: { flexDirection: "row", gap: 10 },
  
    shareBtn: {
      padding: 12,
      borderRadius: 10,
      backgroundColor: "#f97316",
    },
  
    relatedTitle: {
      fontSize: 22,
      fontWeight: "bold",
      marginBottom: 12,
    },
  
    relatedCard: {
      backgroundColor: "#fff",
      borderRadius: 14,
      marginBottom: 16,
      elevation: 3,
      padding: 12,
    },
  
    relatedImage: {
      height: 120,
      borderRadius: 10,
      marginBottom: 8,
    },
  
    relatedName: { fontWeight: "bold", marginBottom: 4 },
  
    relatedExcerpt: { color: "#6b7280", fontSize: 13 },
  
    newsletter: {
      backgroundColor: "#0f172a",
      padding: 20,
      borderRadius: 16,
      marginVertical: 24,
    },
  
    newsTitle: { color: "#fff", fontSize: 20, fontWeight: "bold" },
  
    input: {
      backgroundColor: "#fff",
      borderRadius: 10,
      padding: 12,
      marginTop: 12,
    },
  
    subscribeBtn: {
      backgroundColor: "#f97316",
      padding: 14,
      borderRadius: 10,
      marginTop: 12,
      alignItems: "center",
    },
  
    subscribeText: { color: "#fff", fontWeight: "bold" },
  
    backBtn: {
      flexDirection: "row",
      gap: 6,
      backgroundColor: "#f97316",
      padding: 12,
      borderRadius: 10,
      marginTop: 16,
    },
  
    backText: { color: "#fff", fontWeight: "600" },
  
    errorTitle: { fontSize: 20, fontWeight: "bold" },
  });
  