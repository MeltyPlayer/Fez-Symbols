const corpus = [
	{text: [21, 7]},
	{text: [17, 7]},
	{text: [22, 12, 21]},
	{text: [0, 6, 6, 10]},
	{text: [9, 6, 11, 16]},
	{text: [9, 1, 11, 8]},
	{text: [20, 1, 11, 10]},
	{text: [11, 6, 6, 3]},
	{text: [21, 7, -2, 17, 7]},
	{text: [15, 1, 18, -1, 3, 15, 1, 18]},
	{text: [12, 6, 7, -1, 10, 6, -1, 20, 6, 9, -1, 10, 6]},
	{text: [3, 15, 15, 18, -1, 12, 6, 17, -1, 17, 5, 4, 15, -1, 18, 6]},
	{text: [18, 20, 15, -1, 13, 15, 21, -1, 20, 15, -1, 9, 15, 1, 11, 2]},
	{text: [4, 6, 3, 15, -1, 13, 11, 6, 3, -1, 9, 20, 15, 11, 15, -1, 10, 5, 10, 12, 6, 7]},
	{text: [20, 6, 14, 15, 2, -1, 19, 14, 1, 4, 16, -1, 13, 6, 11, -1, 6, 7, 18, -1, 9, 1, 18, 4, 20]},
	{text: [0, 15, 18, -1, 5, 17, -1, 20, 15, 11, 15, -1, 20, 6, 9, -1, 10, 5, 10, -1, 12, 6, 7, -1, 9, 6, 1, 20]},
	{verified: true, text: [20, 15, 22, 1, 20, 15, 10, 11, 6, 17, -1, 18, 6, 10, 1, 12, -2, 5, -1, 9, 5, 14, 14, -1, 19, 15, -1, 12, 6, 7, 11, -2, 20, 5, -1, 18, 20, 15, 11, 15, -1, 20, 6, 9, -1, 1, 11, 15, -1, 12, 6, 7]},
	{text: [0, 6, 15, 2, -1, 9, 11, 6, 17, 0, -1, 5, 17, -1, 4, 1, 2, 15, -1, 2, 6, 3, 15, 18, 20, 5, 17, 2, -1, 2, 6, 3, 15, 6, 17, 15, -1, 20, 15, 11, 15, -1, 23, 7, 2, 18, -1, 19, 7, 18, -1, 5, -1, 10, 6, -1, 17, 15, 15, 10, -1, 11, 6, 7, 18, 5, 17, 15, -1, 8, 11, 6, 4, 15, 10, 7, 11, 15, -1, 2, 6, -1, 18, 20, 5, 2, -1, 5, 2, -1, 23, 7, 2, 18, -1, 1]},
	{text: [4, 14, 15, 1, 17, -1, 7, 8, -1, 18, 20, 15, -1, 3, 15, 2, 2, -1, 0, 6, 5, 17, 0, -1, 18, 6, -1, 20, 1, 7, 15, -1, 18, 6, -1, 0, 6, -1, 9, 11, 6, 17, 0, -1, 12, 6, 7, -1, 1, 11, 15, -1, 5, 13, -1, 2, 6, 3, 15, 18, 20, 5, 17, 0, -1, 10, 6, 15, 2]}
];

// One letter words
// 5 - A or I

// Two letter words
// 10, 6
// 18, 6
// 20, 5
// 19, 15

const translationMap = {
	6: 'o',
	15: 'e',
	20: 't',	
	17: 'n',
	5: 'a',
	2: 's',
}

/*const translationMap = {
	6: 'e', // t or e
	15: 't', // t or e
	17: 's', // s or n
	20: '#', // 1??
	1: '#',
	19: 'i',
	5: 'a', // or I
	2: 'n', // s or n
};*/

function splitText(text, splitter) {
	const groups = [];
	let group = [];
	for (const symbol of text) {
		if (symbol === splitter) {
			groups.push(group);
			group = [];
		}
		else {
			group.push(symbol);
		}
	}	
	groups.push(group);
	return groups;
}

function splitTextIntoWords(text) {
	const words = [];
	let word = [];
	for (const symbol of text) {
		if (symbol === -1 || symbol === -2) {
			words.push(word);
			word = [];
		}
		else {
			word.push(symbol);
		}
	}	
	words.push(word);
	return words;
}

function splitWordIntoNGrams(word, n) {
	const nGrams = [];
	const len = word.length;
	for (let c = 0; c < len - (n-1); ++c) {
		const nGram = [];
		for (let i = 0; i < n; ++i) {
			nGram.push(word[c + i]);
		}
		nGrams.push(nGram);
	}
	return nGrams;
}

function printNGramFrequencies(n) {
	console.log("");
	console.log(n + "-Gram Frequencies:");
	let totalNGrams = 0;
	const nGramTotals = {};
	for (const text of corpus) {
		const words = splitTextIntoWords(text.text);
		for (const word of words) {
			const nGrams = splitWordIntoNGrams(word, n);
			for (const nGram of nGrams) {
				const count = nGramTotals[nGram];
				nGramTotals[nGram] = (count ? count : 0) + 1;
				totalNGrams += 1;
			}
		}
	}
	const sortedSymbols = [];
	while (Object.keys(nGramTotals).length > 0) {
		let maxSymbol;
		let maxCount = -1;
		for (const symbol in nGramTotals) {
			const count = nGramTotals[symbol];
			if (count > maxCount) {
				maxCount = count;
				maxSymbol = symbol;
			}
		}
		delete nGramTotals[maxSymbol];
		sortedSymbols.push({
			symbol: maxSymbol,
			count: maxCount
		});
	}
	for (const pair of sortedSymbols) {
		const symbols = pair.symbol.split(',');
		let nGramLetters = '';
		for (const symbol of symbols) {
			nGramLetters += translateSymbol(symbol);
		}
		const nGramSymbols = symbols.toString();
		const count = pair.count;
		console.log(nGramLetters + " (" + nGramSymbols + "): " + (100 * count / totalNGrams) + "%");
	}
}

function printWordFrequencies() {
	console.log("");
	console.log("Word Frequencies:");
	let totalWords = 0;
	const wordTotals = {};
	for (const text of corpus) {
		const words = splitTextIntoWords(text.text);
		for (const word of words) {
			const count = wordTotals[word];
			wordTotals[word] = (count ? count : 0) + 1;
			totalWords += 1;
		}
	}
	const sortedWords = [];
	while (Object.keys(wordTotals).length > 0) {
		let maxWord;
		let maxCount = -1;
		for (const word in wordTotals) {
			const count = wordTotals[word];
			if (count > maxCount) {
				maxCount = count;
				maxWord = word;
			}
		}
		delete wordTotals[maxWord];
		sortedWords.push({
			word: maxWord,
			count: maxCount
		});
	}
	for (const pair of sortedWords) {
		const word = pair.word.split(',');
		const translatedWord = translateText(word);
		const count = pair.count;
		console.log(translatedWord + " (" + word + "): " + (100 * count / totalWords) + "%");
	}
}

function translateSymbol(symbol) {
	if (symbol === -1 || symbol === -2) {
		return ' ';
	}
	else {
		const letter = translationMap[symbol];
		return letter ? letter : '#';
	}
}

function translateText(text) {
	let translated = '';
	for (const symbol of text) {
		translated += translateSymbol(symbol);
	}
	return translated;
}

function printTranslatedCorpus() {
	console.log("");
	console.log("Translated corpus:");
	for (const text of corpus) {
		console.log(translateText(text.text));
	}
}

function displayAlphabet() {
}

function displayCorpus() {
	const $corpus = $('<div>', {'class': 'corpus'});
	for (const text of corpus) {
		const $text = $('<div>').addClass('text');
		if (text.verified) {
			$text.addClass('verified');
		}
		const columns = splitText(text.text, -2);
		for (const column of columns) {
			const $column = $('<div>', {'class': 'column'});
			for (const symbol of column) {
				let $symbol;
				if (symbol === -1) {
					$symbol = $('<span>', {'class': 'space'});
				}
				else {
					$symbol = $('<img>', {'class': 'symbol', 'src': 'alphabet/' + symbol + '.png'});
				}
				$column.append($symbol);
			}
			$text.append($column);
		}
		$corpus.append($text);
	}
	$(document.body).append($corpus);
}

function startup() {
	displayAlphabet();
	displayCorpus();
	printNGramFrequencies(1);
	printNGramFrequencies(2);
	printNGramFrequencies(3);
	printWordFrequencies();
	printTranslatedCorpus();
}

startup();