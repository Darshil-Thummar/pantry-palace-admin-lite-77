import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Award, MapPin, Clock } from "lucide-react";

const About = () => {
  const stats = [
    { icon: <Users className="w-8 h-8 text-primary" />, label: "Happy Customers", value: "10,000+" },
    { icon: <Award className="w-8 h-8 text-primary" />, label: "Years of Excellence", value: "15+" },
    { icon: <MapPin className="w-8 h-8 text-primary" />, label: "Local Partners", value: "50+" },
    { icon: <Clock className="w-8 h-8 text-primary" />, label: "Hours Open Daily", value: "16" },
  ];

  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">About Pantry Palace</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Your trusted partner for premium groceries and exceptional service since 2008
          </p>
        </div>

        {/* Mission Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
            <p className="text-lg text-muted-foreground mb-4">
              At Pantry Palace, we believe that everyone deserves access to fresh, high-quality groceries. 
              Our mission is to connect our community with the finest local and organic products while 
              supporting sustainable farming practices.
            </p>
            <p className="text-lg text-muted-foreground">
              We work directly with local farmers and trusted suppliers to ensure every product meets our 
              rigorous standards for freshness, quality, and sustainability.
            </p>
          </div>
          <div>
            <h2 className="text-3xl font-bold mb-6">Our Values</h2>
            <ul className="space-y-4 text-lg text-muted-foreground">
              <li className="flex items-start">
                <span className="w-2 h-2 bg-primary rounded-full mt-3 mr-3 shrink-0"></span>
                <strong>Quality First:</strong> We never compromise on the quality of our products
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-primary rounded-full mt-3 mr-3 shrink-0"></span>
                <strong>Community Support:</strong> We proudly support local farmers and businesses
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-primary rounded-full mt-3 mr-3 shrink-0"></span>
                <strong>Sustainability:</strong> We're committed to environmentally responsible practices
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-primary rounded-full mt-3 mr-3 shrink-0"></span>
                <strong>Customer Care:</strong> Your satisfaction is our top priority
              </li>
            </ul>
          </div>
        </div>

        {/* Stats Section */}
        <div className="hero-gradient rounded-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Our Impact</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Team Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-6">Meet Our Team</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Our dedicated team of grocery experts is passionate about bringing you the best products 
            and service. From our produce specialists to our customer care team, we're here to help 
            you find exactly what you need.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="card-gradient">
              <CardHeader>
                <div className="w-20 h-20 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Users className="w-10 h-10 text-primary" />
                </div>
                <CardTitle>Sarah Johnson</CardTitle>
                <CardDescription>Store Manager</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  15+ years of retail experience, passionate about organic farming and sustainability.
                </p>
              </CardContent>
            </Card>
            
            <Card className="card-gradient">
              <CardHeader>
                <div className="w-20 h-20 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Award className="w-10 h-10 text-primary" />
                </div>
                <CardTitle>Michael Chen</CardTitle>
                <CardDescription>Produce Specialist</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Expert in fresh produce sourcing with direct relationships with local farms.
                </p>
              </CardContent>
            </Card>
            
            <Card className="card-gradient">
              <CardHeader>
                <div className="w-20 h-20 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <MapPin className="w-10 h-10 text-primary" />
                </div>
                <CardTitle>Emily Rodriguez</CardTitle>
                <CardDescription>Customer Experience</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Dedicated to ensuring every customer has an exceptional shopping experience.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;