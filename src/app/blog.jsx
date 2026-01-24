import React, { useEffect, useState } from "react";
import {View,Text,StyleSheet,FlatList,Image,TouchableOpacity,ActivityIndicator,ScrollView} from "react-native";
import { router,useLocalSearchParams, useFocusEffect } from "expo-router";
import ApiService from "../components/ApiService";
import { getAuth } from "../utils/auth/auth";

export default function BlogScreen() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Strip HTML tags
  const stripHtml = (html) => {
    if (!html) return "";
    return html.replace(/<[^>]+>/g, "");
  };

  // Get excerpt
  const getExcerpt = (html, maxLength = 120) => {
    const text = stripHtml(html);
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  // Calculate read time
  const calculateReadTime = (html) => {
    if (!html) return "2 min read";
    const words = stripHtml(html).split(/\s+/).length;
    return `${Math.ceil(words / 200)} min read`;
  };

  const fetchBlogs = async () => {
    try {
        const { token, user } = await getAuth(); // Replace with actual client data retrieval
        const clientId = user ? user?.id : null;

        const res = await ApiService.get("/blogs", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setBlogs(res.blogs || []);
    } catch (err) {
      console.error("Error fetching blogs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push({
        pathname: "/blogDetails",
        params: { id: item.id }
      })}
    >
      {item.photo ? (
        <Image source={{ uri: item.photo }} style={styles.image} />
      ) : (
        <View style={styles.noImage}>
          <Text style={styles.noImageText}>No Image</Text>
        </View>
      )}

      <View style={styles.cardBody}>
        <View style={styles.rowBetween}>
          <Text style={styles.status}>{item.status}</Text>
          <Text style={styles.readTime}>
            {calculateReadTime(item.description)}
          </Text>
        </View>

        <Text style={styles.title} numberOfLines={2}>
          {item.name}
        </Text>

        <Text style={styles.excerpt} numberOfLines={3}>
          {getExcerpt(item.description)}
        </Text>

        <View style={styles.footer}>
          <Text style={styles.date}>
            {new Date(item.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </Text>
          <Text style={styles.readMore}>Read More →</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      {/* Blog List */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Latest Real Estate Articles</Text>
        <Text style={styles.sectionSubtitle}>
          Investment insights, architectural trends, and property tips.
        </Text>

        {loading ? (
          <ActivityIndicator size="large" color="#f97316" />
        ) : blogs.length === 0 ? (
          <Text style={styles.empty}>No blogs available</Text>
        ) : (
          <FlatList
            data={blogs}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            scrollEnabled={false}
          />
        )}
      </View>

    </ScrollView>
  );
}
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff" },
  
    hero: {
      height: 420,
      justifyContent: "center",
    },
    overlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: "rgba(0,0,0,0.5)",
    },
    heroContent: {
      padding: 24,
      alignItems: "center",
    },
    badge: {
      backgroundColor: "#f97316",
      color: "#fff",
      paddingHorizontal: 16,
      paddingVertical: 6,
      borderRadius: 20,
      marginBottom: 16,
      fontWeight: "600",
    },
    heroTitle: {
      fontSize: 30,
      color: "#fff",
      fontWeight: "bold",
      textAlign: "center",
      marginBottom: 12,
    },
    heroSubtitle: {
      color: "#e5e7eb",
      fontSize: 16,
      textAlign: "center",
    },
  
    section: {
      padding: 20,
    },
    sectionTitle: {
      fontSize: 26,
      fontWeight: "bold",
      marginBottom: 6,
    },
    sectionSubtitle: {
      fontSize: 16,
      color: "#6b7280",
      marginBottom: 20,
    },
  
    card: {
      backgroundColor: "#fff",
      borderRadius: 16,
      marginHorizontal: 10,
      marginVertical:20
,      overflow: "hidden",
      elevation: 4,
    },
    image: {
      height: 180,
      width: "100%",
    },
    noImage: {
      height: 180,
      backgroundColor: "#1f2933",
      alignItems: "center",
      justifyContent: "center",
    },
    noImageText: {
      color: "#fff",
      fontSize: 18,
      fontWeight: "bold",
    },
  
    cardBody: {
      padding: 16,
    },
    rowBetween: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 8,
    },
    status: {
      color: "#f97316",
      fontWeight: "600",
    },
    readTime: {
      fontSize: 12,
      color: "#6b7280",
    },
    title: {
      fontSize: 20,
      fontWeight: "bold",
      marginBottom: 8,
    },
    excerpt: {
      color: "#4b5563",
      marginBottom: 16,
    },
    footer: {
      flexDirection: "row",
      justifyContent: "space-between",
      borderTopWidth: 1,
      borderColor: "#eee",
      paddingTop: 12,
    },
    date: {
      fontSize: 12,
      color: "#6b7280",
    },
    readMore: {
      color: "#f97316",
      fontWeight: "600",
    },
  
    empty: {
      textAlign: "center",
      color: "#9ca3af",
      marginTop: 40,
    },
  
    newsletter: {
      backgroundColor: "#0f172a",
      padding: 24,
    },
    newsTitle: {
      color: "#fff",
      fontSize: 24,
      fontWeight: "bold",
      textAlign: "center",
      marginBottom: 10,
    },
    newsSubtitle: {
      color: "#d1d5db",
      textAlign: "center",
      marginBottom: 20,
    },
    input: {
      backgroundColor: "#fff",
      borderRadius: 10,
      padding: 14,
      marginBottom: 14,
    },
    subscribeBtn: {
      backgroundColor: "#f97316",
      padding: 16,
      borderRadius: 10,
      alignItems: "center",
    },
    subscribeText: {
      color: "#fff",
      fontWeight: "bold",
    },
  });
  