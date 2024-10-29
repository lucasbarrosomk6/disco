export interface Product {
    id: number;
    userId: number;
    productName: string;
    tagline: string;
    targetAudience: string;
    mainUseCase: string;
    keyFeatures: string[];
    problemsSolved: string;
    differentiators: string;
    successMetrics: string;
    createdAt: Date;
    updatedAt: Date;
} 