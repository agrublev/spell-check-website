# Spell Check Website

## Use inside node script

```js
const spellCheck = require("spell-check-website");

(async () => {
    let res = await spellCheck("https://spellll.surge.sh/");
    console.log(res);
})();

/* results
{
  link: 'https://spellll.surge.sh/',
  words: [
    { wrong: 'acccount', correct: 'account' },
    { wrong: 'avalable', correct: 'available' },
    { wrong: 'featurs', correct: 'feature' },
    { wrong: 'liek', correct: 'like' }
  ]
}
*/
```

## Or use as command line

```bash
spell-check-website check "https://spellll.surge.sh"
```
