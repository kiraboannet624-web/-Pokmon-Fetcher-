
const searchBtn = document.querySelector('#searchBtn');
const pokemonInput = document.querySelector('#pokemonInput');
const displayArea = document.querySelector('#displayArea');
const loader = document.querySelector('#loader');
const hasRequiredDom = Boolean(searchBtn && pokemonInput && displayArea && loader);



async function fetchPokemon() {
    if (!hasRequiredDom) return;
    const query = pokemonInput.value.toLowerCase().trim();
    if (!query) return;

    
    displayArea.innerHTML = '';
    loader.classList.remove('hidden');
    searchBtn.disabled = true;

    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${query}`);
        
        if (!response.ok) {
            if (response.status === 404) throw new Error('Pokémon not found!');
            throw new Error('Connection error.');
        }

        const data = await response.json();
        renderPokemonCard(data);

    } catch (error) {
        renderError(error.message);
    } finally {
        loader.classList.add('hidden');
        searchBtn.disabled = false;
    }
}

function renderPokemonCard(pokemon) {
    const { name, id, height, weight, base_experience, types, sprites } = pokemon;

    
    const card = document.createElement('div');
    card.className = "bg-slate-50 dark:bg-slate-800 rounded-3xl shadow-2xl overflow-hidden fade-in border border-slate-200 dark:border-slate-700";

    const typeBadges = types.map(t => 
        `<span class="px-3 py-1 rounded-full text-xs font-bold uppercase bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 shadow-sm">
            ${t.type.name}
        </span>`
    ).join('');

    card.innerHTML = `
        <div class="bg-gradient-to-br from-red-500 to-red-600 p-6 flex justify-center relative">
            <span class="absolute top-4 left-4 text-white/40 font-bold text-xl">#${id.toString().padStart(3, '0')}</span>
            <img src="${sprites.front_default}" alt="${name}" class="w-40 h-40 drop-shadow-xl">
        </div>
        
        <div class="p-8">
            <h2 class="text-3xl font-black text-slate-800 dark:text-white capitalize mb-2 text-center">${name}</h2>
            <div class="flex justify-center gap-2 mb-6">
                ${typeBadges}
            </div>

            <div class="grid grid-cols-3 gap-4 text-center border-t border-slate-200 dark:border-slate-700 pt-6">
                <div>
                    <p class="text-xs text-slate-400 uppercase font-bold">Height</p>
                    <p class="font-semibold">${height / 10}m</p>
                </div>
                <div>
                    <p class="text-xs text-slate-400 uppercase font-bold">Weight</p>
                    <p class="font-semibold">${weight / 10}kg</p>
                </div>
                <div>
                    <p class="text-xs text-slate-400 uppercase font-bold">XP</p>
                    <p class="font-semibold">${base_experience}</p>
                </div>
            </div>

            <div class="mt-6 flex justify-center gap-4 bg-white/50 dark:bg-slate-900/50 p-3 rounded-2xl">
                <img src="${sprites.front_default}" class="w-12 h-12" title="Default">
                <img src="${sprites.front_shiny}" class="w-12 h-12" title="Shiny">
                <img src="${sprites.back_default}" class="w-12 h-12" title="Back View">
            </div>
        </div>
    `;

    displayArea.appendChild(card);
}

function renderError(msg) {
    displayArea.innerHTML = `
        <div class="bg-red-100 border-l-4 border-red-500 p-4 rounded-r-xl fade-in">
            <p class="text-red-700 font-bold">${msg}</p>
        </div>
    `;
}


if (hasRequiredDom) {
    searchBtn.addEventListener('click', fetchPokemon);
    pokemonInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') fetchPokemon();
    });
} else {
    console.error('Missing required DOM elements for Pokemon Fetcher.');
}
