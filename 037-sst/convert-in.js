// Copyright Shreevatsa R, 2010. Licenced under the GPL, version 2 or later.
/*
Not yet complete.

The base code for transliteration of Indian languages in general.

In principle something like this could work for any set of alphabets, but I'm not seeking such generality.
*/

if(!this.INtranslit) {
    //To avoid creating global variables put everything in a "closure", returning only things that need to be "global"
    this.INtranslit = function () {
        //For non-Firebug users, console.log should do nothing (not give an error)
        if(typeof(console) === "undefined" || typeof(console.log) === "undefined") var console = { log: function() { } };

        Array.prototype.contains = function(obj) {
          var i = this.length;
          while (i--) {
            if (this[i] === obj) {
              return true;
            }
          }
          return false;
        }

        // Make trie, given a table like {'a':'अ', 'A':'आ', 'ai':'ऐ', 'au':'औ' }
        function maketrie(table) {
            var root = {};
            for(var s in table) {
                //Go down the tree, following the letters of s
                var where = root;
                for(var i=0; i<s.length; ++i) {
                    if(where[s[i]] === undefined) where[s[i]] = {};
                    where = where[s[i]];
                }
                where.label = table[s];
            }
            return root;
        }

        //Convert a string using a labelled trie
        function convert(s, trie) {
            var out = '';
            //d = depth, a = parsed part, b = length of unparsed part
            var where = trie, d = 0, a = '', b = 0;
            var i = 0;
            while(i < s.length) {
                var c = s[i]; ++i;
                ++d;
                ++b;
                //If there is a child in the trie, just follow it
                if(where[c] !== undefined) { 
                    where = where[c];
                    if(where.label !== undefined) {
                        a = where.label; b = 0;
                    }
                }
                // else, go back to the root
                else {                  
                    //If nothing has been parsed, declare the first character as parsed 
                    if(b==d) {
                        a = s[i-b];
                        --b;
                    }
                    out += a;
                    //Go back to unparsed, and start over. (TODO: here a KMP table would help)
                    i -= b;
                    where = trie; d = 0; a = ''; b = 0;
                }
            }
            out += a+s.substr(i-b);
            return out;
        }

        //////////////////////////////////////////////////////////////////////
        //Make object like {'a':'अ', 'A':'आ', 'ai':'ऐ', 'au':'औ', 'k':'क्'}
        function to_sk(alphabet) {
            var ret = {};
            for(var i in alphabet) {
                var rhs = alphabets['sk'][i] + (i>=noncons ? virama : '');
                if(typeof(alphabet[i])=='string') ret[alphabet[i]] = rhs;
                else {
                    for(var c in alphabet[i]) ret[alphabet[i][c]] = rhs;
                }
            }
            return ret;
        }

        //Make object like {'अ':'a', 'आ':'A', 'ऐ':'ai', 'औ':'au' }
        function from_sk(alphabet) {
            var ret = {};
            for(var i in alphabet) {
                var lhs = alphabets['sk'][i] + (i>=noncons ? virama : '');
                if(typeof(alphabet[i])=='string') ret[lhs] = alphabet[i];
                else ret[lhs] = alphabet[i][0];
            }
            return ret;
        };


        //////////////////////////////////////////////////////////////////////

        var matras = { };
          for(var lang in barematras) {
            if(matras[lang] === undefined) matras[lang] = {};
            for(var i=0; i<barematras[lang].length; ++i) {
              matras[lang][alphabets[lang][i]] = barematras[lang][i];
            }
          }

        var unmatras = { };
        for(var lang in matras) {
            if(unmatras[lang] === undefined) unmatras[lang]={};
            for(var v in matras[lang]) {
                var m = matras[lang][v];
                if(m!=='') {
                    unmatras[lang][m] = v;
                }
            }
        }

        function fixmatras(s, lang) { //Replace क्इ            with                 कि
            var matra = matras[lang];
            for(var i in matra) {
                s = s.replace(RegExp(virama+i, "g"), matra[i]);
            }
            return s;
        }

        //////////////////////////////////////////////////////////////////////

        //Ok, explanation: "u" is my canonical Unicode form, in which "ka" and "ki" are both stored as KA+VIRAMA+VOWEL.
        //This is convenient as "k" is always KA+VIRAMA, etc.
        //fixmatras() shows Devanagari, by replacing each VIRAMA+VOWEL with the matra for that vowel.
        //unfixmatras() converts Devanagari to u, by replacing each MATRA with VIRAMA+VOWEL.

        //TODO: Make this exhaustive without hundreds of lines of code
        function insertbraces(s) {
          //Insert braces in ai, au, aii, kh, gh, etc.
          s = s.replace(RegExp('अइ', "g"), 'अ{}इ');
          s = s.replace(RegExp('अउ', "g"), 'अ{}उ');
          return s;
        }

        function removebraces(s) {
          return s.replace(RegExp("{}", "g"), "");
        }

        var vowel = { };
        for(var i=1; i<barematras['sk'].length; ++i) {
          vowel[barematras['sk'][i]] = vowels[i];
        }
        
        function unfixmatras(s) { //Replace कि            with                 क्इ
          //First, replace explicit matras with VIRAMA+VOWEL
          for(var i in vowel) {
            s = s.replace(RegExp(i, "g"), virama+vowel[i]);
          }
          //Next, replace implicit 'a' with VIRAMA+A
          var t = '';
          for(var i=0; i<s.length; ++i) {
            t += s[i];
            if(consonants.contains(s[i]) && s[i+1]!==virama) { //Even if it is undefined!
              t += virama + implicita;
            }
          }
          return t;
        }

        var ret = {
            devanagari2u: function(s)  {
                return insertbraces(unfixmatras(s, 'sk'));
            },
            u2devanagari: function(s) {
                return removebraces(fixmatras(s, 'sk'));
            },
            u2html: function(s) {
                s = this.u2devanagari(s);
                var t='';
                for(var i=0;i<s.length;++i) {
                    if(s.charCodeAt(i)>=128) t+='&#' + s.charCodeAt(i) + ';';
                    else t+=s[i];
                }
                return t;
            },
            html2u: function(s) {
                var t = '';
                for(var i=0;i<s.length;++i) {
                    if(s[i]=='&' && s[i+1]=='#') {
                        for(var j=i;s.charAt(j)!=';';++j)
                            ;
                        var n = s.substring(i+2,j) * 1;
                        t += String.fromCharCode(n);
                        i = j;
                    } else {
                        t += s[i];
                    }
                }
                return this.devanagari2u(t);
            }
        };

        for(var f in {itrans:'', harvardkyoto:'', velthuis:'', IAST:'', iast:'', ipa:''}) {
          var g = function () { //Need to do it inside a function, because of the broken "closure" model
            var t = maketrie(to_sk(alphabets[f]));
            var u = maketrie(from_sk(alphabets[f]));
            ret[f+"2u"] = function(s) { return convert(s, t); }
            ret["u2"+f] = function(s) { return convert(s, u); }
          }();
        }

        console.log('matras -- ');
        console.log(matras['sk']);
        console.log('unmatras-- ');
        console.log(unmatras['sk']);
        return ret;
    }();
}
