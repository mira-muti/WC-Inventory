

export const queryKeys = {
    activityLog: {
        all: ['activityLog'] as const,
        byUser: (userId: string) => ['activityLog', { userId }] as const,
    },
    locations: {
        all: ['locations'] as const,
        detail: (locationId: string) => [...queryKeys.locations.all, locationId] as const,
    },
    categories: {
        all: ['categories'] as const,
        detail: (categoryId: string) => [...queryKeys.categories.all, categoryId] as const
    },
    users: {
        all: ['users'] as const,
        detail: (userId: string) => [...queryKeys.users.all, userId] as const,
    },
    sizes:{
        all:['sizes'] as const,
        detail: (sizeId: string) => [...queryKeys.sizes.all, sizeId] as const
    }
};