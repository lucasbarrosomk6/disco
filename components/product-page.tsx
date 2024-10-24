'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle, Target, Zap, Shield, TrendingUp } from "lucide-react"

export function ProductPage({ product = {
  productName: "Project Tracking Software",
  tagline: "Streamline your workflow and boost productivity",
  targetAudience: "Small to medium-sized businesses",
  mainUseCase: "Efficient project management and team collaboration",
  keyFeatures: ["Real-time updates", "Task assignment", "Progress tracking", "File sharing", "Reporting tools"],
  problemsSolved: "Eliminates communication gaps, reduces project delays, and improves team productivity",
  differentiators: "AI-powered insights and intuitive user interface",
  successMetrics: "Increased on-time project completion rates and improved team efficiency"
} }) {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-primary">{product.productName}</h1>
        <p className="text-xl text-muted-foreground">{product.tagline}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Target Audience
            </CardTitle>
          </CardHeader>
          <CardContent>{product.targetAudience}</CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              Main Use Case
            </CardTitle>
          </CardHeader>
          <CardContent>{product.mainUseCase}</CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-primary" />
            Key Features
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {product.keyFeatures.map((feature, index) => (
              <Badge key={index} variant="secondary">{feature}</Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Problems Solved
          </CardTitle>
        </CardHeader>
        <CardContent>{product.problemsSolved}</CardContent>
      </Card>

      {product.differentiators && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              Differentiators
            </CardTitle>
          </CardHeader>
          <CardContent>{product.differentiators}</CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Success Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>{product.successMetrics}</CardContent>
      </Card>

      <div className="text-center">
        <Button size="lg">Explore More Features</Button>
      </div>
    </div>
  )
}