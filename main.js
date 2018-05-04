// One letter words
// 5 - A or I

// Two letter words
// 10, 6
// 18, 6
// 20, 5
// 19, 15

const translationMap = {
	0: 'g',
	1: 'a',
	2: 's',
	3: 'm',
	4: 'c',
	5: 'i',
	6: 'o',
	7: 'u',
	8: 'p',
	9: 'w',
	10: 'd',
	11: 'r',
	12: 'y',
	13: 'f',
	14: 'l',
	15: 'e',
	16: 'k',
	17: 'n',
	18: 't',
	19: 'b',
	20: 'h',
	21: 'z',
	22: 'x',
	23: 'j',
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

function splitTextIntoColumns(text) {
	const columns = splitText(text, -2);
	return columns;
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
	if (symbol === -1) {
		return ' ';
	}
	else if (symbol === -2) {
		return '\n';
	}
	else {
		const letter = translationMap[symbol];
		return letter ? letter : symbol;
	}
}

function translateText(text) {
	let translated = '';
	const columns = splitTextIntoColumns(text);
	columns.reverse();
	for (const column of columns) {
		for (const symbol of column) {
			translated += translateSymbol(symbol);
		}
		translated += '\n';
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
	const $alphabet = $('<div>').addClass('alphabet');
	for (const symbol in translationMap) {
		const letter = translationMap[symbol];
		let $symbolWrapper = $('<span>').addClass('symbol-wrapper');
		if(symbol >= 0) {
			const $symbol = $('<img>', {'class': 'symbol', 'src': 'alphabet/' + symbol + '.png'});
			$symbolWrapper.append($symbol);
			
			const $translatedSymbol = $('<span>').addClass('translated-symbol').text(symbol + ', ' + letter);
			$symbolWrapper.append($translatedSymbol);
		}
		$alphabet.append($symbolWrapper);
	}
	$(document.body).append($alphabet);
}

function displayCorpus() {
	const $corpus = $('<div>').addClass('corpus');
	for (const text of corpus) {
		const $text = $('<div>').addClass('text');
		if (text.verified) {
			$text.addClass('verified');
		}
		const columns = splitTextIntoColumns(text.text);
		for (const column of columns) {
			const $column = $('<div>').addClass('column');
			for (const symbol of column) {
				let $symbolWrapper = $('<span>').addClass('symbol-wrapper');
				if(symbol >= 0) {
					const $symbol = $('<img>', {'class': 'symbol', 'src': 'alphabet/' + symbol + '.png'});
					$symbolWrapper.append($symbol);
					
					const $translatedSymbol = $('<span>').addClass('translated-symbol').text(translateSymbol(symbol));
					$symbolWrapper.append($translatedSymbol);
				}
				$column.append($symbolWrapper);
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