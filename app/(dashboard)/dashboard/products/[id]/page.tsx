'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loading } from '@/components/ui/loading';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ChevronDown, ChevronUp, Target, Zap, Shield, TrendingUp, CheckCircle2, Edit2, Plus, Trash2, Check } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

// Utility function to split text by newline and wrap each paragraph in a <p> tag
function formatText(text: string) {
  return text.split('\n').map((paragraph, index) => (
    <p key={index} className="mb-4">{paragraph}</p>
  ));
}

interface ProductDetails {
  id: number;
  productName: string;
  tagline?: string;
  targetAudience: string;
  mainUseCase: string;
  keyFeatures: string[];
  problemsSolved: string;
  differentiators?: string;
  successMetrics: string;
}

export default function ProductInformationPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [product, setProduct] = useState<ProductDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState({
    targetAudience: false,
    mainUseCase: false,
    problemsSolved: false,
    differentiators: false,
    successMetrics: false,
  });
  const [editingSections, setEditingSections] = useState({
    productName: false,
    tagline: false,
    targetAudience: false,
    mainUseCase: false,
    problemsSolved: false,
    differentiators: false,
    successMetrics: false,
  });
  const [editingFeatures, setEditingFeatures] = useState<number[]>([]);
  const [editedProduct, setEditedProduct] = useState<ProductDetails | null>(null);

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }))
  }

  const toggleEdit = (section: keyof typeof editingSections) => {
    setEditingSections((prev) => ({ ...prev, [section]: !prev[section] }))
  }

  const toggleFeatureEdit = (index: number) => {
    setEditingFeatures((prev) => 
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  }

  useEffect(() => {
    async function fetchProduct() {
      try {
        const response = await fetch(`/api/dashboard/products/${params.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch product');
        }
        const data = await response.json();
        setProduct(data);
        setEditedProduct(data);
      } catch (error) {
        console.error('Error fetching product:', error);
        setError('Failed to load product. Please try again.');
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [params.id]);

  const handleInputChange = (field: keyof ProductDetails, value: string | string[]) => {
    if (editedProduct) {
      setEditedProduct({ ...editedProduct, [field]: value });
    }
  };

  const handleFeatureChange = (index: number, value: string) => {
    if (editedProduct) {
      const newFeatures = [...editedProduct.keyFeatures];
      newFeatures[index] = value;
      setEditedProduct({ ...editedProduct, keyFeatures: newFeatures });
    }
  };

  const handleAddFeature = () => {
    if (editedProduct) {
      const newFeatures = [...editedProduct.keyFeatures, ''];
      setEditedProduct({ ...editedProduct, keyFeatures: newFeatures });
      setEditingFeatures((prev) => [...prev, editedProduct.keyFeatures.length]);
    }
  };

  const handleRemoveFeature = (index: number) => {
    if (editedProduct) {
      const newFeatures = editedProduct.keyFeatures.filter((_, i) => i !== index);
      setEditedProduct({ ...editedProduct, keyFeatures: newFeatures });
      setEditingFeatures((prev) => prev.filter(i => i !== index));
    }
  };

  const handleSave = async (field: keyof ProductDetails) => {
    if (!editedProduct) return;

    try {
      const response = await fetch(`/api/dashboard/products/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ [field]: editedProduct[field] }),
      });

      if (!response.ok) {
        throw new Error('Failed to update product');
      }
      setProduct(editedProduct);
      if (field !== 'keyFeatures') {
        toggleEdit(field as keyof typeof editingSections);
      } else {
        setEditingFeatures([]);
      }
    } catch (error) {
      console.error('Error updating product:', error);
      setError('Failed to update product. Please try again.');
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <p className="text-center text-red-600">{error}</p>;
  }

  if (!product || !editedProduct) {
    return <p className="text-center text-red-600">Product not found.</p>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="text-center space-y-2 relative">
        {editingSections.productName ? (
          <Input
            value={editedProduct.productName}
            onChange={(e) => handleInputChange('productName', e.target.value)}
            onBlur={() => handleSave('productName')}
            className="text-4xl font-bold text-primary px-12"
          />
        ) : (
          <h1 className="text-4xl font-bold text-primary">{product.productName}</h1>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-0 right-0"
          onClick={() => toggleEdit('productName')}
        >
          <Edit2 className="h-4 w-4" />
        </Button>
        {editingSections.tagline ? (
          <Input
            value={editedProduct.tagline || ''}
            onChange={(e) => handleInputChange('tagline', e.target.value)}
            onBlur={() => handleSave('tagline')}
            className="text-xl text-muted-foreground"
          />
        ) : (
          product.tagline && <p className="text-xl text-muted-foreground px-12">{product.tagline}</p>
        )}
        {product.tagline && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-12 right-0"
            onClick={() => toggleEdit('tagline')}
          >
            <Edit2 className="h-4 w-4" />
          </Button>
        )}
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="features">Key Features</TabsTrigger>
          <TabsTrigger value="details">Additional Details</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Target Audience
                <Button
                  variant="ghost"
                  size="icon"
                  className="ml-auto"
                  onClick={() => toggleEdit('targetAudience')}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {editingSections.targetAudience ? (
                <Textarea
                  value={editedProduct.targetAudience}
                  onChange={(e) => handleInputChange('targetAudience', e.target.value)}
                  onBlur={() => handleSave('targetAudience')}
                />
              ) : (
                <>
                  <div className={`${expandedSections.targetAudience ? '' : 'line-clamp-3'}`}>
                    {formatText(product.targetAudience)}
                  </div>
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
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                Main Use Case
                <Button
                  variant="ghost"
                  size="icon"
                  className="ml-auto"
                  onClick={() => toggleEdit('mainUseCase')}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {editingSections.mainUseCase ? (
                <Textarea
                  value={editedProduct.mainUseCase}
                  onChange={(e) => handleInputChange('mainUseCase', e.target.value)}
                  onBlur={() => handleSave('mainUseCase')}
                />
              ) : (
                <>
                  <div className={`${expandedSections.mainUseCase ? '' : 'line-clamp-3'}`}>
                    {formatText(product.mainUseCase)}
                  </div>
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
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="features" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                Key Features
                <div className="ml-auto space-x-2">
                  {editingFeatures.length > 0 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleSave('keyFeatures')}
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleAddFeature}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className=" w-full pr-4">
                <ul className="space-y-4">
                  {editedProduct.keyFeatures.map((feature, index) => (
                    <li key={index} className="border-b pb-4 last:border-b-0">
                      {editingFeatures.includes(index) ? (
                        <Textarea
                          value={feature}
                          onChange={(e) => handleFeatureChange(index, e.target.value)}
                        />
                      ) : (
                        <div className="flex items-start justify-between">
                          <p>{feature}</p>
                          <div className="block">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => toggleFeatureEdit(index)}
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRemoveFeature(index)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="details" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Problems Solved
                <Button
                  variant="ghost"
                  size="icon"
                  className="ml-auto"
                  onClick={() => toggleEdit('problemsSolved')}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {editingSections.problemsSolved ? (
                <Textarea
                  value={editedProduct.problemsSolved}
                  onChange={(e) => handleInputChange('problemsSolved', e.target.value)}
                  onBlur={() => handleSave('problemsSolved')}
                />
              ) : (
                <>
                  <div className={`${expandedSections.problemsSolved ? '' : 'line-clamp-3'}`}>
                    {formatText(product.problemsSolved)}
                  </div>
                  <Button
                    variant="link"
                    onClick={() => toggleSection('problemsSolved')}
                    className="mt-2"
                  >
                    {expandedSections.problemsSolved ? (
                      <>
                        See less <ChevronUp className="ml-2 h-4 w-4" />
                      </>
                    ) : (
                      <>
                        See more <ChevronDown className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </>
              )}
            </CardContent>
          </Card>

          {product.differentiators && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  Differentiators
                  <Button
                    variant="ghost"
                    size="icon"
                    
                    className="ml-auto"
                    onClick={() => toggleEdit('differentiators')}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {editingSections.differentiators ? (
                  <Textarea
                    value={editedProduct.differentiators || ''}
                    onChange={(e) => handleInputChange('differentiators', e.target.value)}
                    onBlur={() => handleSave('differentiators')}
                  />
                ) : (
                  <>
                    <div className={`${expandedSections.differentiators ? '' : 'line-clamp-3'}`}>
                      {formatText(product.differentiators)}
                    </div>
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
                  </>
                )}
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Success Metrics
                <Button
                  variant="ghost"
                  size="icon"
                  className="ml-auto"
                  onClick={() => toggleEdit('successMetrics')}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {editingSections.successMetrics ? (
                <Textarea
                  value={editedProduct.successMetrics}
                  onChange={(e) => handleInputChange('successMetrics', e.target.value)}
                  onBlur={() => handleSave('successMetrics')}
                />
              ) : (
                <>
                  <div className={`${expandedSections.successMetrics ? '' : 'line-clamp-3'}`}>
                    {formatText(product.successMetrics)}
                  </div>
                  <Button
                    variant="link"
                    onClick={() => toggleSection('successMetrics')}
                    className="mt-2"
                  >
                    {expandedSections.successMetrics ? (
                      <>
                        See less <ChevronUp className="ml-2 h-4 w-4" />
                      </>
                    ) : (
                      <>
                        See more <ChevronDown className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="text-center">
        <Button size="lg">Get Started with {product.productName}</Button>
      </div>
    </div>
  )
}