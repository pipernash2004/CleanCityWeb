import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, X } from "lucide-react";
import { reportsAPI, uploadAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "wouter";

type Category = "waste" | "water" | "road";

export default function ReportForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<Category | "">("");
  const [location, setLocation] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(""); // local preview
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>(""); // URL from backend
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [, navigate] = useLocation();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    setUploadedImageUrl(""); // reset backend URL if reselecting

    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview("");
    setUploadedImageUrl("");
  };

  const uploadImage = async (): Promise<string> => {
    if (!imageFile) return "";
    try {
      setUploading(true);
      const response = await uploadAPI.uploadImage(imageFile);
      setUploadedImageUrl(response.data.imageUrl);
      return response.data.imageUrl;
    } catch (err: any) {
      console.error("Image upload failed:", err);
      toast({
        title: "Upload failed",
        description: err.response?.data?.message || "Failed to upload image",
        variant: "destructive",
      });
      return "";
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (authLoading) return;
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please login to submit a report",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    setLoading(true);

    try {
      // Step 1: Upload image if needed
      let imageUrl = uploadedImageUrl;
      if (imageFile && !imageUrl) {
        imageUrl = await uploadImage();
        if (!imageUrl) {
          setLoading(false);
          return; // stop submission if upload failed
        }
      }

      // Step 2: Submit report
      await reportsAPI.create({
        title,
        description,
        category: category as string,
        location,
        imageUrl,
      });

      toast({
        title: "Report submitted successfully",
        description: "Thank you for helping improve your community!",
      });

      // Reset form
      setTitle("");
      setDescription("");
      setCategory("");
      setLocation("");
      setImageFile(null);
      setImagePreview("");
      setUploadedImageUrl("");

      navigate("/reports");
    } catch (err: any) {
      console.error("Error submitting report:", err);
      toast({
        title: "Submission failed",
        description: err.response?.data?.message || "Failed to submit report",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6 md:p-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div className="space-y-2">
          <Label htmlFor="title">Report Title *</Label>
          <Input
            id="title"
            placeholder="Brief description of the issue"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description">Description *</Label>
          <Textarea
            id="description"
            placeholder="Provide detailed information about the issue"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="min-h-32"
          />
        </div>

        {/* Category & Location */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Select value={category} onValueChange={(value) => setCategory(value as Category)} required>
              <SelectTrigger id="category">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="waste">waste</SelectItem>
                <SelectItem value="water">water</SelectItem>
                <SelectItem value="road">road</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location *</Label>
            <Input
              id="location"
              placeholder="Street address or landmark"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Image Upload */}
        <div className="space-y-2">
          <Label>Photo (Optional)</Label>
          {imagePreview || uploadedImageUrl ? (
            <div className="relative">
              <img
                src={uploadedImageUrl || imagePreview}
                alt="Preview"
                className="w-full h-48 object-cover rounded-lg"
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2"
                onClick={removeImage}
              >
                <X className="w-4 h-4" />
              </Button>
              {uploading && (
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center text-white font-bold">
                  Uploading...
                </div>
              )}
            </div>
          ) : (
            <label
              htmlFor="image"
              className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer hover-elevate transition-all"
            >
              <div className="flex flex-col items-center justify-center gap-2">
                <Upload className="w-8 h-8 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Click to upload image</p>
                <p className="text-xs text-muted-foreground">Maximum size: 5MB</p>
              </div>
              <input
                id="image"
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageChange}
              />
            </label>
          )}
        </div>

        {/* Submit */}
        <Button type="submit" className="w-full" size="lg" disabled={loading || authLoading}>
          {authLoading ? "Loading..." : loading ? "Submitting..." : "Submit Report"}
        </Button>
      </form>
    </Card>
  );
}
