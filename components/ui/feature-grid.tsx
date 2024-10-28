import { Button } from "@/components/ui/button"
import { MagnifyingGlassIcon } from "@radix-ui/react-icons"
import { Video, Zap, User, Filter, BarChart, ArrowRight, Target, Lightbulb, Clock, Cloud, TrendingUp, Share2, ShieldCheck, SearchIcon } from "lucide-react"

const features = [
    {
        "icon": <SearchIcon className='h-6 w-6' />, // Use SearchIcon to emphasize detailed, relevant insights.
        "title": "Relevant Insights",
        "description": "Our research uses your product's unique selling points to find the most relevant information for your prospect.",
        "bgColor": "bg-blue-100"
    },
    {
        "icon": <ShieldCheck className='h-6 w-6' />, // ShieldCheck conveys accuracy, trust, and credibility.
        "title": "No Hallucinations",
        "description": "Each statement in the report links to a publicly available source, ensuring accuracy and credibility.",
        "bgColor": "bg-green-100"
    },
    {
        "icon": <Share2 className='h-6 w-6' />, // Share2 represents the ability to share and export findings.
        "title": "Share Your Findings",
        "description": "Quickly share your findings with your team or prospects. With PDF and markdown export options.",
        "bgColor": "bg-yellow-100"
    },
    {
        "icon": <Zap className='h-6 w-6' />, // Zap suggests speed and efficiency.
        "title": "Get Results in Minutes",
        "description": "Last minute research? No problem. Our research is lightning fast.",
        "bgColor": "bg-blue-100"
    },

];



export default function Component() {
    return (
        <section className="py-2 px-4 md:px-6 bg-white">
            <div className=" mx-auto">
                <section className="py-4 ">
                    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 my-3">
                        <div className="flex flex-col ">
                            <div className="text-center">
                                <h1 className="text-3xl font-bold text-gray-900 tracking-tight sm:text-4xl md:text-5xl">
                                    Unlock Prospect Potential
                                    <span className="block text-blue-600">with AI-Powered Sales Enablement</span>
                                </h1>
                                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg lg:text-xl">
                                    Empower your sales team with AI-driven insights that speak directly to prospect needs.
                                </p>

                            </div>

                        </div>
                    </div>
                </section>
                <div className=" max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 my-3">
                    <div className="flex flex-wrap justify-center gap-8">
                        {features.map((feature, index) => (
                            <div key={index} className="flex flex-col items-center text-center flex-1 min-w-56 max-w-64">
                                <div className={`rounded-full p-3 ${feature.bgColor} mb-4`}>
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                                <p className="text-gray-600">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-12 text-center">
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-full text-lg px-8 py-4 sm:px-12 sm:py-6 inline-flex items-center justify-center">
                        Start Your Free Trial
                        <ArrowRight className="ml-3 h-6 w-6" />
                    </Button>
                </div>
            </div>
        </section>
    )
}