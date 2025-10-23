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
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [, navigate] = useLocation();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Wait for auth to load before checking
    if (authLoading) {
      return;
    }

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
      let imageUrl = "";

      // Upload image if selected
      if (image) {
        const uploadResponse = await uploadAPI.uploadImage(image);
        imageUrl = uploadResponse.data.imageUrl;
      }

      // Create report
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
      setImage(null);
      setImagePreview("");

      // Navigate to reports page
      navigate("/reports");
    } catch (error: any) {
      console.error("Error submitting report:", error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to submit report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6 md:p-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title">Report Title *</Label>
          <Input
            id="title"
            placeholder="Brief description of the issue"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            data-testid="input-title"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description *</Label>
          <Textarea
            id="description"
            placeholder="Provide detailed information about the issue"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="min-h-32"
            data-testid="input-description"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Select value={category} onValueChange={(value) => setCategory(value as Category)} required>
              <SelectTrigger id="category" data-testid="select-category">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="waste">Waste Management</SelectItem>
                <SelectItem value="water">Water/Plumbing</SelectItem>
                <SelectItem value="road">Road/Infrastructure</SelectItem>
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
              data-testid="input-location"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Photo (Optional)</Label>
          {imagePreview ? (
            <div className="relative">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-48 object-cover rounded-lg"
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2"
                onClick={removeImage}
                data-testid="button-remove-image"
              >
                <X className="w-4 h-4" />
              </Button>
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
                data-testid="input-image"
              />
            </label>
          )}
        </div>

        <Button type="submit" className="w-full" size="lg" disabled={loading || authLoading} data-testid="button-submit">
          {authLoading ? "Loading..." : loading ? "Submitting..." : "Submit Report"}
        </Button>
      </form>
    </Card>
  );
}
