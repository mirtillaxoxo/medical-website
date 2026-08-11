import { kv } from 'hub:kv'

export interface GooglePlaceReview {
  name: string
  relativePublishTimeDescription: string
  rating: number
  text: {
    text: string
    languageCode: string
  }
  originalText: {
    text: string
    languageCode: string
  }
  authorAttribution: {
    displayName: string
    uri: string
    photoUri: string
  }
  publishTime: string
  flagContentUri: string
  googleMapsUri: string
}

interface ReviewsCache {
  reviews: GooglePlaceReview[]
  rating: number
  userRatingCount: number
  cachedAt: number
}

const CACHE_KEY = 'google-reviews-v2'
const CACHE_TTL = 60 * 60 * 24 // 24 ore in secondi

export default eventHandler(async (event) => {
  const cached = await kv.get<ReviewsCache>(CACHE_KEY)

  const isFresh = cached && (Date.now() - cached.cachedAt) / 1000 < CACHE_TTL

  if (isFresh) {
    console.log(
      `[reviews] CACHE HIT — età: ${Math.round(
        (Date.now() - cached.cachedAt) / 1000,
      )}s`,
    )

    return {
      reviews: cached.reviews,
      rating: cached.rating,
      userRatingCount: cached.userRatingCount,
    }
  }

  console.log('[reviews] CACHE MISS — chiamo Google Places API')

  const { maps_places_api_key, place_id } = useRuntimeConfig().google

  try {
    const { reviews, rating, userRatingCount } = await $fetch<{
      reviews: GooglePlaceReview[]
      rating: number
      userRatingCount: number
    }>(`https://places.googleapis.com/v1/places/${place_id}`, {
      headers: {
        'X-Goog-Api-Key': maps_places_api_key,
      },
      query: {
        languageCode: 'it',
        fields: 'reviews,rating,userRatingCount',
      },
    })

    await kv.set(CACHE_KEY, {
      reviews,
      rating,
      userRatingCount,
      cachedAt: Date.now(),
    })

    console.log('[reviews] nuova cache salvata su KV')

    return {
      reviews,
      rating,
      userRatingCount,
    }
  } catch (e) {
    console.error('[reviews] errore chiamata API:', e)

    if (cached) {
      console.log('[reviews] servo cache scaduta come fallback')

      return {
        reviews: cached.reviews,
        rating: cached.rating,
        userRatingCount: cached.userRatingCount,
      }
    }

    throw e
  }
})
