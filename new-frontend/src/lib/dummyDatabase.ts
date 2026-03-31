// src/lib/database.ts

import { v4 as uuidv4 } from 'uuid';

export const mockUsers = [
    {
        user_id: uuidv4(),
        username: "admin_jane",
        password: "hashed_password_1",
        role: "Admin",
        created_at: "2024-01-15T10:00:00Z",
        updated_at: "2024-01-15T10:00:00Z"
    },
    {
        user_id: uuidv4(),
        username: "volunteer_john",
        password: "hashed_password_2",
        role: "Volunteer",
        created_at: "2024-01-16T10:00:00Z",
        updated_at: "2024-01-16T10:00:00Z"
    },
    {
        user_id: uuidv4(),
        username: "supervisor_sarah",
        password: "hashed_password_3",
        role: "Supervisor",
        created_at: "2024-01-17T09:00:00Z",
        updated_at: "2024-01-17T09:00:00Z"
    },
    {
        user_id: uuidv4(),
        username: "volunteer_mike",
        password: "hashed_password_4",
        role: "Volunteer",
        created_at: "2024-01-18T11:00:00Z",
        updated_at: "2024-01-18T11:00:00Z"
    },
    {
        user_id: uuidv4(),
        username: "coordinator_lisa",
        password: "hashed_password_5",
        role: "Coordinator",
        created_at: "2024-01-19T14:00:00Z",
        updated_at: "2024-01-19T14:00:00Z"
    }
];

export const mockCategories = [
    {
        category_id: uuidv4(),
        name: "Clothing",
        description: "All types of clothing items",
        level: 0,
        parent_id: null
    },
    {
        category_id: uuidv4(),
        name: "Tops",
        description: "Shirts, t-shirts, and other upper body clothing",
        level: 1,
        parent_id: "parent_clothing_id"
    },
    {
        category_id: uuidv4(),
        name: "Bottoms",
        description: "Pants, shorts, and skirts",
        level: 1,
        parent_id: "parent_clothing_id"
    },
    {
        category_id: uuidv4(),
        name: "Outerwear",
        description: "Jackets, coats, and outdoor wear",
        level: 1,
        parent_id: "parent_clothing_id"
    },
    {
        category_id: uuidv4(),
        name: "Accessories",
        description: "Belts, scarves, and other accessories",
        level: 1,
        parent_id: "parent_clothing_id"
    },
    {
        category_id: uuidv4(),
        name: "Shoes",
        description: "All types of footwear",
        level: 1,
        parent_id: "parent_clothing_id"
    },
    {
        category_id: uuidv4(),
        name: "Athletic Wear",
        description: "Sports and exercise clothing",
        level: 1,
        parent_id: "parent_clothing_id"
    }
];

export const mockLocations = [
    {
        location_id: uuidv4(),
        name: "Main Warehouse",
        description: "Primary storage facility",
        level: 0,
        parent_id: null
    },
    {
        location_id: uuidv4(),
        name: "Section A",
        description: "First floor, left wing",
        level: 1,
        parent_id: "main_warehouse_id"
    },
    {
        location_id: uuidv4(),
        name: "Section B",
        description: "First floor, right wing",
        level: 1,
        parent_id: "main_warehouse_id"
    },
    {
        location_id: uuidv4(),
        name: "Section C",
        description: "Second floor, storage area",
        level: 1,
        parent_id: "main_warehouse_id"
    },
    {
        location_id: uuidv4(),
        name: "Shelf 1A",
        description: "First shelf in Section A",
        level: 2,
        parent_id: "section_a_id"
    },
    {
        location_id: uuidv4(),
        name: "Shelf 2A",
        description: "Second shelf in Section A",
        level: 2,
        parent_id: "section_a_id"
    },
    {
        location_id: uuidv4(),
        name: "Shelf 1B",
        description: "First shelf in Section B",
        level: 2,
        parent_id: "section_b_id"
    },
    {
        location_id: uuidv4(),
        name: "Processing Area",
        description: "Sorting and processing zone",
        level: 1,
        parent_id: "main_warehouse_id"
    }
];

export const mockBoxes = [
    {
        box_id: uuidv4(),
        name: "BOX-001",
        description: "Winter clothing",
        location_id: "shelf_1a_id",
        created_at: "2024-01-15T10:00:00Z",
        updated_at: "2024-01-15T10:00:00Z"
    },
    {
        box_id: uuidv4(),
        name: "BOX-002",
        description: "Summer clothing",
        location_id: "shelf_1a_id",
        created_at: "2024-01-16T10:00:00Z",
        updated_at: "2024-01-16T10:00:00Z"
    },
    {
        box_id: uuidv4(),
        name: "BOX-003",
        description: "Children's clothing",
        location_id: "shelf_2a_id",
        created_at: "2024-01-17T11:00:00Z",
        updated_at: "2024-01-17T11:00:00Z"
    },
    {
        box_id: uuidv4(),
        name: "BOX-004",
        description: "Athletic wear",
        location_id: "shelf_1b_id",
        created_at: "2024-01-18T09:00:00Z",
        updated_at: "2024-01-18T09:00:00Z"
    },
    {
        box_id: uuidv4(),
        name: "BOX-005",
        description: "Accessories and shoes",
        location_id: "shelf_1b_id",
        created_at: "2024-01-19T14:30:00Z",
        updated_at: "2024-01-19T14:30:00Z"
    }
];

export const mockBoxContents = [
    {
        box_content_id: uuidv4(),
        box_id: "box_001_id",
        size: "M",
        category_id: "tops_id",
        gender: "Male",
        quantity: 5
    },
    {
        box_content_id: uuidv4(),
        box_id: "box_001_id",
        size: "6",
        category_id: "tops_id",
        gender: "Kids",
        quantity: 3
    },
    {
        box_content_id: uuidv4(),
        box_id: "box_002_id",
        size: "L",
        category_id: "bottoms_id",
        gender: "Female",
        quantity: 4
    },
    {
        box_content_id: uuidv4(),
        box_id: "box_003_id",
        size: "8",
        category_id: "outerwear_id",
        gender: "Kids",
        quantity: 6
    },
    {
        box_content_id: uuidv4(),
        box_id: "box_003_id",
        size: "10",
        category_id: "bottoms_id",
        gender: "Kids",
        quantity: 8
    },
    {
        box_content_id: uuidv4(),
        box_id: "box_004_id",
        size: "S",
        category_id: "athletic_wear_id",
        gender: "Female",
        quantity: 4
    },
    {
        box_content_id: uuidv4(),
        box_id: "box_004_id",
        size: "M",
        category_id: "athletic_wear_id",
        gender: "Male",
        quantity: 3
    },
    {
        box_content_id: uuidv4(),
        box_id: "box_005_id",
        size: "ONE",
        category_id: "accessories_id",
        gender: "Unisex",
        quantity: 10
    }
];

export const mockBoxMovements = [
    {
        box_movement_id: uuidv4(),
        box_id: "box_001_id",
        moved_by: "volunteer_john_id",
        moved_at: "2024-01-17T10:00:00Z",
        from_location_id: "shelf_1a_id",
        to_location_id: "section_a_id",
        note: "Moved for inventory check"
    },
    {
        box_movement_id: uuidv4(),
        box_id: "box_002_id",
        moved_by: "volunteer_mike_id",
        moved_at: "2024-01-18T11:30:00Z",
        from_location_id: "shelf_1a_id",
        to_location_id: "shelf_2a_id",
        note: "Reorganizing summer clothing"
    },
    {
        box_movement_id: uuidv4(),
        box_id: "box_003_id",
        moved_by: "volunteer_john_id",
        moved_at: "2024-01-19T09:15:00Z",
        from_location_id: "processing_area_id",
        to_location_id: "shelf_2a_id",
        note: "Initial placement after sorting"
    },
    {
        box_movement_id: uuidv4(),
        box_id: "box_004_id",
        moved_by: "supervisor_sarah_id",
        moved_at: "2024-01-20T13:45:00Z",
        from_location_id: "shelf_1b_id",
        to_location_id: "processing_area_id",
        note: "Quality check needed"
    }
];

export const mockTags = [
    {
        tag_id: uuidv4(),
        name: "Winter",
        description: "Winter season clothing"
    },
    {
        tag_id: uuidv4(),
        name: "Donation",
        description: "Items received from recent donation drive"
    },
    {
        tag_id: uuidv4(),
        name: "Quality Check",
        description: "Items requiring quality inspection"
    },
    {
        tag_id: uuidv4(),
        name: "Priority",
        description: "High-demand items needed soon"
    },
    {
        tag_id: uuidv4(),
        name: "New Arrival",
        description: "Recently received items"
    },
    {
        tag_id: uuidv4(),
        name: "Reserved",
        description: "Items reserved for specific programs"
    }
];

export const mockBoxTags = [
    {
        box_id: "box_001_id",
        tag_id: "winter_tag_id"
    },
    {
        box_id: "box_002_id",
        tag_id: "donation_tag_id"
    },
    {
        box_id: "box_003_id",
        tag_id: "new_arrival_tag_id"
    },
    {
        box_id: "box_003_id",
        tag_id: "priority_tag_id"
    },
    {
        box_id: "box_004_id",
        tag_id: "quality_check_tag_id"
    },
    {
        box_id: "box_005_id",
        tag_id: "donation_tag_id"
    },
    {
        box_id: "box_005_id",
        tag_id: "new_arrival_tag_id"
    }
];

// Helper function to get all mock data
export const getMockData = () => ({
    users: mockUsers,
    categories: mockCategories,
    locations: mockLocations,
    boxes: mockBoxes,
    boxContents: mockBoxContents,
    boxMovements: mockBoxMovements,
    tags: mockTags,
    boxTags: mockBoxTags
});

// Types
interface User {
    user_id: string;
    username: string;
    password: string;
    role: string;
    created_at: string;
    updated_at: string;
}

interface Category {
    category_id: string;
    name: string;
    description: string;
    level: number;
    parent_id: string | null;
}

interface Location {
    location_id: string;
    name: string;
    description: string;
    level: number;
    parent_id: string | null;
}

interface Box {
    box_id: string;
    name: string;
    description: string;
    location_id: string;
    created_at: string;
    updated_at: string;
}

interface BoxContent {
    box_content_id: string;
    box_id: string;
    size: string;
    category_id: string;
    gender: string;
    quantity: number;
}

interface BoxMovement {
    box_movement_id: string;
    box_id: string;
    moved_by: string;
    moved_at: string;
    from_location_id: string;
    to_location_id: string;
    note: string;
}

interface Tag {
    tag_id: string;
    name: string;
    description: string;
}

interface BoxTag {
    box_id: string;
    tag_id: string;
}

// Box Related Helpers
export const findRelatedBoxContents = (boxId: string): BoxContent[] => {
    return mockBoxContents.filter(content => content.box_id === boxId);
};

export const findBoxLocation = (boxId: string): Location | null => {
    const box = mockBoxes.find(b => b.box_id === boxId);
    return box ? mockLocations.find(l => l.location_id === box.location_id) || null : null;
};

export const findBoxTags = (boxId: string): Tag[] => {
    const boxTagIds = mockBoxTags
        .filter(bt => bt.box_id === boxId)
        .map(bt => bt.tag_id);
    return mockTags.filter(tag => boxTagIds.includes(tag.tag_id as string));
};


export const getBoxHistory = (boxId: string): BoxMovement[] => {
    return mockBoxMovements
        .filter(movement => movement.box_id === boxId)
        .sort((a, b) => new Date(b.moved_at).getTime() - new Date(a.moved_at).getTime());
};

// Location Related Helpers
export const findBoxesInLocation = (locationId: string): Box[] => {
    return mockBoxes.filter(box => box.location_id === locationId);
};


// Category Related Helpers
export const findSubcategories = (categoryId: string): Category[] => {
    return mockCategories.filter(cat => cat.parent_id === categoryId);
};



// User Related Helpers
export const findUserMovements = (userId: string): BoxMovement[] => {
    return mockBoxMovements
        .filter(movement => movement.moved_by === userId)
        .sort((a, b) => new Date(b.moved_at).getTime() - new Date(a.moved_at).getTime());
};

export const findUsersByRole = (role: string): User[] => {
    return mockUsers.filter(user => user.role === role);
};

// Inventory Related Helpers
export const getInventoryByCategory = (categoryId: string): { size: string; gender: string; totalQuantity: number }[] => {
    return mockBoxContents
        .filter(content => content.category_id === categoryId)
        .reduce((acc, content) => {
            const key = `${content.size}-${content.gender}`;
            const existing = acc.find(item => item.size === content.size && item.gender === content.gender);

            if (existing) {
                existing.totalQuantity += content.quantity;
            } else {
                acc.push({
                    size: content.size,
                    gender: content.gender,
                    totalQuantity: content.quantity
                });
            }

            return acc;
        }, [] as { size: string; gender: string; totalQuantity: number }[]);
};

export const getBoxesWithTag = (tagName: string): Box[] => {
    const tag = mockTags.find(t => t.name === tagName);
    if (!tag) return [];

    const boxIds = mockBoxTags
        .filter(bt => bt.tag_id === tag.tag_id)
        .map(bt => bt.box_id);

    return mockBoxes.filter(box => boxIds.includes(<string>box.box_id));
};



