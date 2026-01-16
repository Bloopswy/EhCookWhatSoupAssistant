// Supported soups list
const SUPPORTED_SOUPS = [
    'Lotus Root with Peanut Soup',
    'ABC Soup',
    'Watercress Soup',
    'Old Cucumber Soup',
    'Herbal Chicken Soup'
];

// Recipe data storage
let recipes = [];

// Load and parse CSV file
async function loadRecipes() {
    try {
        const response = await fetch('EhCookWhat_Soup_Recipe.csv');
        const csvText = await response.text();
        
        // Parse CSV
        const lines = csvText.trim().split('\n');
        const headers = lines[0].split(',');
        
        // Parse each line
        for (let i = 1; i < lines.length; i++) {
            const values = parseCSVLine(lines[i]);
            
            if (values.length >= 6) {
                const recipe = {
                    soup_name: values[0],
                    difficulty: values[1],
                    ingredients: values[2],
                    cook_time_minutes: parseInt(values[3]),
                    instructions: values[4],
                    source: values[5]
                };
                
                // Only add supported soups
                if (SUPPORTED_SOUPS.includes(recipe.soup_name)) {
                    recipes.push(recipe);
                }
            }
        }
        
        // Sort recipes to match the order in SUPPORTED_SOUPS
        recipes.sort((a, b) => {
            return SUPPORTED_SOUPS.indexOf(a.soup_name) - SUPPORTED_SOUPS.indexOf(b.soup_name);
        });
        
        displayRecipes();
    } catch (error) {
        console.error('Error loading recipes:', error);
        document.getElementById('recipeGrid').innerHTML = '<p style="color: #C97D60; text-align: center;">Error loading recipes. Please try again later.</p>';
    }
}

// Parse CSV line handling quoted commas
function parseCSVLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        
        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            result.push(current.trim());
            current = '';
        } else {
            current += char;
        }
    }
    
    result.push(current.trim());
    return result;
}

// Get recipe description
function getRecipeDescription(soupName) {
    const descriptions = {
        'ABC Soup': 'Classic comfort soup with corn, carrots, tomatoes, and potatoes in a naturally sweet broth.',
        'Watercress Soup': 'Refreshing and nutritious soup with tender watercress and flavorful pork ribs.',
        'Lotus Root with Peanut Soup': 'Hearty and nourishing soup with lotus root and peanuts in a rich, fragrant broth.',
        'Old Cucumber Soup': 'Light and clear soup with softened old cucumber, perfect for hot weather.',
        'Herbal Chicken Soup': 'Traditional Chinese herbal soup with chicken, promoting wellness and vitality.'
    };
    return descriptions[soupName] || 'Delicious traditional Chinese soup recipe.';
}

// Get recipe image
function getRecipeImage(soupName) {
    const images = {
        'ABC Soup': 'Pictures/AbcSoup.jpg',
        'Watercress Soup': 'Pictures/watercress.jpg',
        'Lotus Root with Peanut Soup': 'Pictures/lotus.jpg',
        'Old Cucumber Soup': 'Pictures/oldcucumbersoup.jpg',
        'Herbal Chicken Soup': 'Pictures/chinesechickenherbalsoup.jpg'
    };
    return images[soupName] || 'Pictures/AbcSoup.jpg';
}

// Display recipe cards
function displayRecipes() {
    const recipeGrid = document.getElementById('recipeGrid');
    
    if (recipes.length === 0) {
        recipeGrid.innerHTML = '<p style="color: #C97D60; text-align: center;">No recipes available at the moment.</p>';
        return;
    }
    
    recipeGrid.innerHTML = recipes.map(recipe => `
        <div class="recipe-card">
            <img src="${getRecipeImage(recipe.soup_name)}" alt="${recipe.soup_name}" class="recipe-card-image">
            <div class="recipe-card-content">
                <h3 class="recipe-card-title">${recipe.soup_name}</h3>
                <div class="recipe-card-badges">
                    <span class="recipe-badge time">⏱️ ${formatCookTime(recipe.cook_time_minutes)}</span>
                    <span class="recipe-badge difficulty">🔥 ${recipe.difficulty.toUpperCase()}</span>
                </div>
                <p class="recipe-card-description">${getRecipeDescription(recipe.soup_name)}</p>
                <button class="recipe-card-button" onclick="openRecipeModal('${recipe.soup_name}')">
                    View Full Recipe
                </button>
            </div>
        </div>
    `).join('');
}

// Format cooking time
function formatCookTime(minutes) {
    if (minutes < 60) {
        return `${minutes} minutes`;
    } else {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        if (mins === 0) {
            return `${hours} hour${hours > 1 ? 's' : ''}`;
        } else {
            return `${hours} hour${hours > 1 ? 's' : ''} ${mins} minutes`;
        }
    }
}

// Open recipe modal
function openRecipeModal(soupName) {
    const recipe = recipes.find(r => r.soup_name === soupName);
    
    if (!recipe) {
        console.error('Recipe not found:', soupName);
        return;
    }
    
    // Populate modal
    document.getElementById('modalImage').src = getRecipeImage(recipe.soup_name);
    document.getElementById('modalImage').alt = recipe.soup_name;
    document.getElementById('modalTitle').textContent = recipe.soup_name;
    document.getElementById('modalCookTime').textContent = formatCookTime(recipe.cook_time_minutes);
    document.getElementById('modalDifficulty').textContent = recipe.difficulty;
    
    // Parse and display ingredients
    const ingredients = recipe.ingredients.split(',').map(i => i.trim());
    document.getElementById('modalIngredients').innerHTML = ingredients
        .map(ingredient => `<li>${ingredient}</li>`)
        .join('');
    
    // Parse and display instructions
    // Handle instructions with numbered format (1) 2) etc.) or period-separated
    let instructions;
    if (recipe.instructions.includes(')')) {
        // Split by numbered format
        instructions = recipe.instructions
            .split(/\d+\)\s*/)
            .filter(i => i.trim().length > 0)
            .map(i => i.trim());
    } else {
        // Split by periods (old format)
        instructions = recipe.instructions
            .split('.')
            .filter(i => i.trim().length > 0)
            .map(i => i.trim());
    }
    
    document.getElementById('modalInstructions').innerHTML = instructions
        .map(instruction => `<li>${instruction.replace(/\.$/, '')}.</li>`)
        .join('');
    
    // Show modal
    const modal = document.getElementById('recipeModal');
    modal.classList.add('active');
    modal.style.display = 'block';
    
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
}

// Close recipe modal
function closeRecipeModal() {
    const modal = document.getElementById('recipeModal');
    modal.classList.remove('active');
    modal.style.display = 'none';
    
    // Restore body scroll
    document.body.style.overflow = 'auto';
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('recipeModal');
    if (event.target === modal) {
        closeRecipeModal();
    }
}

// Close modal with Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeRecipeModal();
    }
});

// Load recipes when page loads
document.addEventListener('DOMContentLoaded', loadRecipes);
