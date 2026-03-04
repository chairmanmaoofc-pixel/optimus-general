import { Star, Quote, ChevronLeft, ChevronRight, Send } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Review {
  id: string;
  user_id: string;
  name: string;
  role: string;
  rating: number;
  content: string;
  created_at: string;
}

const stats = [
  { value: "500+", label: "Happy Customers" },
  { value: "4.9", label: "Average Rating" },
  { value: "98%", label: "Satisfaction Rate" },
  { value: "24/7", label: "Support Available" },
];

const Reviews = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [user, setUser] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({ name: "", role: "", rating: 5, content: "" });
  const { toast } = useToast();

  const reviewsPerPage = 3;
  const totalPages = Math.ceil(reviews.length / reviewsPerPage);
  const currentReviews = reviews.slice(
    currentPage * reviewsPerPage,
    (currentPage + 1) * reviewsPerPage
  );

  useEffect(() => {
    fetchReviews();
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  const fetchReviews = async () => {
    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) setReviews(data);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({ title: "Please log in to submit a review", variant: "destructive" });
      return;
    }
    if (!formData.name.trim() || !formData.content.trim()) {
      toast({ title: "Please fill in your name and review", variant: "destructive" });
      return;
    }

    setSubmitting(true);
    const { error } = await supabase.from("reviews").insert({
      user_id: user.id,
      name: formData.name,
      role: formData.role,
      rating: formData.rating,
      content: formData.content,
    });

    if (error) {
      toast({ title: "Failed to submit review", variant: "destructive" });
    } else {
      toast({ title: "Review submitted successfully!" });
      setFormData({ name: "", role: "", rating: 5, content: "" });
      fetchReviews();
    }
    setSubmitting(false);
  };

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const days = Math.floor(diff / 86400000);
    if (days < 1) return "Today";
    if (days < 7) return `${days} day${days > 1 ? "s" : ""} ago`;
    if (days < 30) return `${Math.floor(days / 7)} week${Math.floor(days / 7) > 1 ? "s" : ""} ago`;
    return `${Math.floor(days / 30)} month${Math.floor(days / 30) > 1 ? "s" : ""} ago`;
  };

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden bg-muted">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block px-4 py-2 rounded-full bg-accent/50 text-accent-foreground text-sm font-medium mb-6 border border-accent/30">
              ⭐ Customer Reviews
            </span>
            <h1 className="text-4xl font-bold mb-6 text-primary md:text-7xl">
              What Our Customers
              <span className="block mt-2 text-accent">Are Saying</span>
            </h1>
            <p className="text-lg md:text-xl text-foreground">
              Real experiences from real customers. See why hundreds trust us
              with their cooling needs.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <div key={i} className="text-center p-6 rounded-2xl glass-card border border-border/50">
              <div className="text-3xl md:text-4xl font-bold text-gradient mb-2">{stat.value}</div>
              <div className="text-muted-foreground text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Reviews */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Customer Testimonials</h2>
            <p className="text-muted-foreground">Don't just take our word for it — hear from our satisfied customers</p>
          </div>

          {loading ? (
            <div className="text-center text-muted-foreground py-12">Loading reviews...</div>
          ) : reviews.length === 0 ? (
            <div className="text-center text-muted-foreground py-12">No reviews yet. Be the first to share your experience!</div>
          ) : (
            <>
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                {currentReviews.map((review) => (
                  <div key={review.id} className="relative bg-card rounded-2xl p-6 shadow-soft border border-border/50">
                    <div className="absolute -top-3 -right-3 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Quote className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex gap-1 mb-4">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`w-4 h-4 ${i < review.rating ? "fill-accent text-accent" : "text-muted-foreground/30"}`} />
                      ))}
                    </div>
                    <p className="text-foreground/90 mb-6">"{review.content}"</p>
                    <div className="flex items-center gap-3 pt-4 border-t border-border/50">
                      <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold">
                        {review.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-medium text-foreground">{review.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {review.role && `${review.role} • `}{timeAgo(review.created_at)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex justify-center gap-3">
                  <Button variant="outline" size="icon" onClick={() => setCurrentPage((p) => Math.max(0, p - 1))} disabled={currentPage === 0} className="rounded-full">
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <Button key={i} variant={currentPage === i ? "default" : "outline"} size="icon" onClick={() => setCurrentPage(i)} className="rounded-full">
                      {i + 1}
                    </Button>
                  ))}
                  <Button variant="outline" size="icon" onClick={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))} disabled={currentPage === totalPages - 1} className="rounded-full">
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Submit Review */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-2">Share Your Experience</h2>
            <p className="text-muted-foreground">
              {user ? "We'd love to hear your feedback!" : "Please log in to submit a review."}
            </p>
          </div>

          {user && (
            <form onSubmit={handleSubmit} className="bg-card rounded-2xl p-8 shadow-soft border border-border/50 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Your Name *</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData((f) => ({ ...f, name: e.target.value }))}
                    placeholder="Enter your name"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Your Role</label>
                  <Input
                    value={formData.role}
                    onChange={(e) => setFormData((f) => ({ ...f, role: e.target.value }))}
                    placeholder="e.g. Homeowner, Business Owner"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Rating *</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFormData((f) => ({ ...f, rating: star }))}
                    >
                      <Star className={`w-7 h-7 transition-colors ${star <= formData.rating ? "fill-accent text-accent" : "text-muted-foreground/30"}`} />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Your Review *</label>
                <Textarea
                  value={formData.content}
                  onChange={(e) => setFormData((f) => ({ ...f, content: e.target.value }))}
                  placeholder="Share your experience with us..."
                  rows={4}
                />
              </div>

              <Button type="submit" disabled={submitting} className="w-full">
                <Send className="w-4 h-4 mr-2" />
                {submitting ? "Submitting..." : "Submit Review"}
              </Button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
};

export default Reviews;
