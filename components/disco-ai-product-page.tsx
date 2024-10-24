'use client'

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ChevronDown, ChevronUp, Target, Zap, Shield, TrendingUp, CheckCircle2, Lightbulb } from "lucide-react"

export function DiscoAiProductPage() {
  const [expandedSections, setExpandedSections] = useState({
    targetAudience: false,
    mainUseCase: false,
    problemsSolved: false,
    differentiators: false,
    successMetrics: false,
  })

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }))
  }

  const features = [
    {
      title: "Instant Company Reports",
      description: "Generate comprehensive, real-time reports on any company. Obtain detailed insights into a prospect's key initiatives, challenges, recent activities, and competitive positioning. This feature reduces manual research time from hours to minutes.",
      icon: <Zap className="h-6 w-6 text-primary" />,
    },
    {
      title: "Tailored Value Propositions",
      description: "Input your product's key features, and Disco.ai's AI engine matches them with the prospect's specific needs and pain points. This enables you to create personalized sales pitches that resonate with potential clients.",
      icon: <Target className="h-6 w-6 text-primary" />,
    },
    {
      title: "AI-Driven Sales Discovery",
      description: "Leverage artificial intelligence to uncover hidden opportunities and key business activities within prospect companies. The platform identifies growth initiatives and business signals that may not be immediately apparent, enhancing your sales discovery process.",
      icon: <Lightbulb className="h-6 w-6 text-primary" />,
    },
  ]

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-primary">Disco.ai</h1>
        <p className="text-xl text-muted-foreground">Sales Enablement supercharged with AI</p>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="features">Key Features</TabsTrigger>
          <TabsTrigger value="problems">Problems Solved</TabsTrigger>
          <TabsTrigger value="success">Success Metrics</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Target Audience
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className={`${expandedSections.targetAudience ? '' : 'line-clamp-3'}`}>
                Disco.ai is designed primarily for: SaaS Sales Professionals: Sales representatives who focus on selling software-as-a-service products and need to engage with potential clients effectively. Sales Enablement Teams: Professionals responsible for providing sales teams with the resources, tools, and information necessary to improve their productivity and effectiveness.
              </p>
              <Button
                variant="link"
                onClick={() => toggleSection('targetAudience')}
                className="mt-2"
              >
                {expandedSections.targetAudience ? (
                  <>
                    See less <ChevronUp className="ml-2 h-4 w-4" />
                  </>
                ) : (
                  <>
                    See more <ChevronDown className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                Main Use Case
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className={`${expandedSections.mainUseCase ? '' : 'line-clamp-3'}`}>
                The main use case of disco.ai is to accelerate the sales process by providing AI-driven company insights and tailored value propositions. Specifically, it helps users to: Generate Instant Company Reports: Quickly obtain detailed insights about potential client companies, including key initiatives, recent activities, and challenges. Create Personalized Sales Pitches: Align the user's product features with the specific needs and pain points of prospects, resulting in more compelling and relevant sales conversations. Reduce Manual Research Time: Automate the time-consuming task of researching prospects, allowing sales professionals to focus more on building relationships and closing deals. Improve Sales Effectiveness: Enhance the quality of outreach efforts by using data-driven insights to engage prospects with messages that resonate.
              </p>
              <Button
                variant="link"
                onClick={() => toggleSection('mainUseCase')}
                className="mt-2"
              >
                {expandedSections.mainUseCase ? (
                  <>
                    See less <ChevronUp className="ml-2 h-4 w-4" />
                  </>
                ) : (
                  <>
                    See more <ChevronDown className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Differentiators
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className={`${expandedSections.differentiators ? '' : 'line-clamp-3'}`}>
                Disco.ai sets itself apart through AI-driven personalization at scale, instant comprehensive company reports, continuous learning with data retention, a user-friendly interface, scalable pricing, future-proof features, real-time data updates, seamless integrations, robust security, and dedicated support.
              </p>
              <Button
                variant="link"
                onClick={() => toggleSection('differentiators')}
                className="mt-2"
              >
                {expandedSections.differentiators ? (
                  <>
                    See less <ChevronUp className="ml-2 h-4 w-4" />
                  </>
                ) : (
                  <>
                    See more <ChevronDown className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="features" className="space-y-6">
          {features.map((feature, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {feature.icon}
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="problems" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Problems Solved
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px] w-full">
                <ul className="space-y-4">
                  <li>
                    <strong>Time-Consuming Manual Research:</strong> Automates research process, providing instant insights.
                  </li>
                  <li>
                    <strong>Generic and Ineffective Sales Pitches:</strong> Enables creation of tailored value propositions.
                  </li>
                  <li>
                    <strong>Missed Sales Opportunities:</strong> Uncovers hidden opportunities and key business signals.
                  </li>
                  <li>
                    <strong>Inconsistent Sales Messaging:</strong> Standardizes messaging with data-driven insights.
                  </li>
                  <li>
                    <strong>Extended Sales Cycles:</strong> Reduces overall sales cycle duration.
                  </li>
                  <li>
                    <strong>Inefficient Lead Qualification:</strong> Helps identify high-potential prospects.
                  </li>
                  <li>
                    <strong>Difficulty Entering New Markets:</strong> Provides industry-specific insights for new market entry.
                  </li>
                  <li>
                    <strong>Overwhelming Data Analysis:</strong> Synthesizes data into concise, actionable reports.
                  </li>
                  <li>
                    <strong>Low Conversion Rates Due to Poor Timing:</strong> Identifies optimal times for engagement.
                  </li>
                  <li>
                    <strong>Lack of Knowledge Retention and Sharing:</strong> Builds a shared knowledge base for the entire team.
                  </li>
                </ul>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="success" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Success Metrics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px] w-full">
                <ul className="space-y-4">
                  <li>
                    <strong>Increased Sales Productivity:</strong> More time spent engaging prospects, less on research.
                  </li>
                  <li>
                    <strong>Higher Conversion Rates:</strong> Personalized pitches lead to improved engagement and conversions.
                  </li>
                  <li>
                    <strong>Accelerated Sales Cycles:</strong> Faster progression from initial contact to deal closure.
                  </li>
                  <li>
                    <strong>Enhanced Lead Qualification:</strong> Better identification of high-potential prospects.
                  </li>
                  <li>
                    <strong>Improved Sales Messaging Consistency:</strong> Unified, data-driven messages across the team.
                  </li>
                  <li>
                    <strong>Successful Market Expansion:</strong> Effective entry into new markets with industry-specific insights.
                  </li>
                  <li>
                    <strong>Revival of Stalled Opportunities:</strong> Re-engaging prospects with updated insights.
                  </li>
                  <li>
                    <strong>Increased Revenue:</strong> Overall growth due to improved conversion rates and faster cycles.
                  </li>
                  <li>
                    <strong>Better Customer Relationships:</strong> More meaningful interactions fostering loyalty.
                  </li>
                  <li>
                    <strong>Scalable Sales Operations:</strong> Handle more prospects without compromising personalization.
                  </li>
                  <li>
                    <strong>Enhanced Team Morale and Confidence:</strong> Sales professionals feel more equipped and confident.
                  </li>
                  <li>
                    <strong>Data-Driven Decision Making:</strong> Strategies informed by real-time, actionable insights.
                  </li>
                </ul>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="text-center">
        <Button size="lg">Get Started with Disco.ai</Button>
      </div>
    </div>
  )
}