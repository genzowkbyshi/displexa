import { apiClient } from '@/lib/api-client';

export interface PublicMenuResponse {
  company: {
    id: string;
    name: string;
    slug: string;
    phone?: string;
    email?: string;
    website?: string;
    logoUrl?: string;
    coverImageUrl?: string;
    description?: string;
    whatsApp?: string;
    address?: string;
    googleMapsUrl?: string;
    latitude?: number | null;
    longitude?: number | null;
    socialLinks?: {
      platform: string;
      url: string;
      displayOrder: number;
    }[];
    workingHours?: {
      dayOfWeek: string;
      isClosed: boolean;
      openTime?: string | null;
      closeTime?: string | null;
    }[];
  };
  branch: {
    id: string;
    name: string;
    slug: string;
    phone?: string;
    email?: string;
    address?: string;
    isDefault?: boolean;
  };
  settings: {
    layout: 'Grid' | 'ListWithImage' | 'SimpleList';
    theme: string;
    primaryColor: string;
    secondaryColor: string;
    backgroundColor: string;
    textColor: string;
    showPrices: boolean;
    showProductImages: boolean;
    showProductDescriptions: boolean;
    showCategoryImages: boolean;
    showCategoryDescriptions: boolean;
    showPreparationTime: boolean;
    showCalories: boolean;
    showAllergens: boolean;
    showTags: boolean;
  };
  banners: {
    targetCategorySlug: string;
    targetProductSlug?: string | null;
    imageUrl?: string | null;
    videoUrl?: string | null;
    mediaType: 'Image' | 'Video' | string;
    displayOrder: number;
  }[];
  categories: {
    id: string;
    slug: string;
    name: string;
    description?: string;
    imageUrl?: string;
    displayOrder: number;
    products: {
      id: string;
      slug: string;
      name: string;
      description?: string;
      price: number;
      imageUrl?: string;
      preparationTimeMinutes?: number;
      calories?: number;
      allergens: {
        name: string;
        emoji?: string;
        backgroundColor?: string;
        textColor?: string;
      }[];
      tags: any[];
    }[];
  }[];
}

export const publicMenuService = {
  getMenu: (companySlug: string, branchSlug: string, locale: string = 'tr'): Promise<PublicMenuResponse> => {
    const params = new URLSearchParams({
      locale,
      _: Date.now().toString(),
    });

    return apiClient.get(`/public/menus/${companySlug}/${branchSlug}?${params.toString()}`);
  }
};
