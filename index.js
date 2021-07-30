const Hand = class {
    constructor() {
        this.num_list = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A']
        this.rank = ''
        this.score = 0
    }

    check_hand = (showncards) => {
        let rank_array = []
        let score_array = []
        const hands_combo = combination(showncards, 5)
        hands_combo.forEach((hand) => {
            // console.log(hand); //["As", "3d", "4c", "5s", "2c"]
            const num_array = hand.map((e) => this.num_list.findIndex((ele) => ele == e.substr(0, 1)) + 2)
            const suit_array = hand.map((e) => e.substr(1, 1))
            // console.log('num_array: ' + num_array); //[14, 3, 4, 5, 2]
            // console.log(suit_array); //["s", "d", "c", "s", "c"]

            //各数字の出現回数
            let num_counts = {}
            num_array.forEach(element => {
                num_counts[element] = (num_counts[element]) ? num_counts[element] + 1 : 1;
            });
            //各スートの出現回数
            let suit_counts = {}
            suit_array.forEach(element => {
                suit_counts[element] = (suit_counts[element]) ? suit_counts[element] + 1 : 1;
            });
            const rnum = num_array.map((e) => num_counts[e])
            const rsuit = suit_array.map((e) => suit_counts[e]) //[2, 1, 2, 2, 2]
            const dif = Math.max(...num_array) - Math.min(...num_array)
            // console.log('rnum: ' + rnum); //[1, 1, 1, 1, 1]
            // console.log('rsuit: ' + rsuit); //[2, 1, 2, 2, 2]
            // console.log(dif); //12

            let rank, score
            //判定
            if (Math.max(...rsuit) == 5) {
                if (num_array.sort((a, b) => a - b) == [10, 11, 12, 13, 14]) {
                    rank = 'royalflush'
                    score = 135
                } else if (dif == 4 && Math.max(...rnum) == 1) {
                    rank = 'straightflush'
                    score = 120 + Math.max(...num_array)
                } else if (this.compare_array(num_array.sort((a, b) => a - b), [2, 3, 4, 5, 14])) {
                    rank = 'straightflush'
                    score = 125
                } else {
                    rank = 'flush'
                    score = 75 + Math.max(...num_array) / 100
                }
            } else if (Math.max(...rnum) == 4) {
                rank = 'four card'
                score = this.check_fourcard(num_array, rnum)
            } else if (this.compare_array(rnum.slice().sort((a, b) => a - b), [2, 2, 3, 3, 3])) {
                rank = 'fullhouse'
                score = this.check_fullhouse(num_array, rnum)
            } else if (Math.max(...rnum) == 3) {
                rank = 'three card'
                score = this.check_threecard(num_array, rnum)
            } else if (this.count_pair(rnum) == 4) {
                rank = 'two pair'
                score = this.check_twopair(num_array, rnum)
            } else if (this.count_pair(rnum) == 2) {
                rank = 'one pair'
                score = this.check_onepair(num_array, rnum)
            } else if (dif == 4 && Math.max(...rnum) == 1) {
                rank = 'straight'
                score = 60 + Math.max(...num_array)
            } else if (this.compare_array(num_array.sort((a, b) => a - b), [2, 3, 4, 5, 14])) {
                rank = 'straight'
                score = 65
            } else {
                rank = 'high card'
                num_array.sort((a, b) => a - b)
                score = num_array[4] + num_array[3] / 100 + num_array[2] / 1000 + num_array[1] / 10000 + num_array[0] / 100000
            }
            rank_array.push(rank)
            score_array.push(score)
        })

        //最大スコアの役を成立役とする
        let index = 0
        let value = 0
        for (let i = 0; i < score_array.length; i++) {
            if (value < score_array[i]) {
                value = score_array[i]
                index = i
            }
        }
        this.rank = rank_array[index]
        this.score = score_array[index]
    }


    check_fourcard = (num_array, rnum) => {
        let four, kicker
        for (let i = 0; i < num_array.length; i++) {
            if (rnum[i] == 4) {
                four = num_array[i]
            } else {
                kicker = num_array[i]
            }
        }
        const score = 105 + four + kicker / 100
        return score
    }

    check_fullhouse = (num_array, rnum) => {
        let trio, pair
        for (let i = 0; i < num_array.length; i++) {
            if (rnum[i] == 3) {
                trio = num_array[i]
            } else {
                pair = num_array[i]
            }
        }
        const score = 90 + trio + pair / 100
        return score
    }

    check_threecard = (num_array, rnum) => {
        let trio
        let kicker = []
        for (let i = 0; i < num_array.length; i++) {
            if (rnum[i] == 3) {
                trio = num_array[i]
            } else {
                kicker.push(num_array[i])
            }
        }
        const score = 45 + trio + Math.max(...kicker) / 100 + Math.min(...kicker) / 1000
        return score
    }

    count_pair = (rnum) => {
        let count = 0
        rnum.forEach((e) => {
            if (e == 2) {
                count += 1
            }
        })
        return count
    }

    check_twopair = (num_array, rnum) => {
        let pairs = []
        let kicker
        for (let i = 0; i < num_array.length; i++) {
            if (rnum[i] == 2) {
                pairs.push(num_array[i])
            } else {
                kicker = num_array[i]
            }
        }
        const score = 30 + Math.max(...pairs) + Math.min(...pairs) / 100 + kicker / 1000
        return score
    }

    check_onepair = (num_array, rnum) => {
        let pair = []
        let kicker = []
        for (let i = 0; i < num_array.length; i++) {
            if (rnum[i] == 2) {
                pair.push(num_array[i])
            } else {
                kicker.push(num_array[i])
            }
        }
        kicker.sort((a, b) => b - a)
        const score = 15 + pair[0] + kicker[0] / 100 + kicker[1] / 1000 + kicker[2] / 10000
        return score
    }

    compare_array = (arr1, arr2) => {
        for (let i = 0; i < arr1.length; i++) {
            if (arr1[i] != arr2[i]) {
                return false;
            }
        }
        return true
    }

    check_flushdraw = (hand) => {
        const suit_array = hand.map((e) => e.substr(1, 1))
        this.flushdraw = ''
        //各スートの出現回数
        let suit_counts = {}
        suit_array.forEach(element => {
            suit_counts[element] = (suit_counts[element]) ? suit_counts[element] + 1 : 1;
        });
        const rsuit = suit_array.map((e) => suit_counts[e])

        //判定
        if (Math.max(...rsuit) >= 5) {
            this.flushdraw = 'flush'
        } else if (hand.length <= 6 && Math.max(...rsuit) == 4) {
            this.flushdraw = 'flush draw'
        } else if (hand.length == 5 && Math.max(...rsuit) == 3) {
            this.flushdraw = 'backdoor flush draw'
        }
    }

    check_straightdraw = (hand) => {
        const num_array = hand.map((e) => this.num_list.findIndex((ele) => ele == e.substr(0, 1)) + 2)
        //数字の重複を除いたもの
        const new_array = Array.from(new Set(num_array))
        this.straightdraw = []
        //重複除く数字が4つ以上の場合（役完成除く）、ストレートドローの判定処理
        if (new_array.length >= 4 && this.rank != 'straightflush' && this.rank != 'straight') {
            //配列のうち4つを取り出し判定する処理を全ての組み合わせで行う
            const array_combi = combination(new_array, 4)
            array_combi.forEach((e) => {
                const dif = Math.max(...e) - Math.min(...e)
                //判定
                if (this.compare_array(e.sort((a, b) => a - b), [2, 3, 4, 14]) |
                    this.compare_array(e.sort((a, b) => a - b), [2, 3, 5, 14]) |
                    this.compare_array(e.sort((a, b) => a - b), [2, 4, 5, 14]) |
                    this.compare_array(e.sort((a, b) => a - b), [3, 4, 5, 14]) |
                    this.compare_array(e.sort((a, b) => a - b), [11, 12, 13, 14])) {
                    this.straightdraw.push('gutshot straight draw')
                } else if (dif == 3) {
                    //[2, 3, 4, 5]など
                    this.straightdraw.push('openend straight draw')
                } else if (dif == 4) {
                    //[2, 3, 5, 6]など
                    this.straightdraw.push('gutshot straight draw')
                }
            })
        }
        //重複除く数字が3つ以上の場合かつ役完成とストレートドローがない場合のみバックドアストレートドローの判定を行う
        if (hand.length == 5 && new_array.length >= 3 && this.straightdraw.length == 0 && this.rank != 'straightflush' && this.rank != 'straight') {
            const array_combi = combination(new_array, 3)
            array_combi.forEach((e) => {
                const dif = Math.max(...e) - Math.min(...e)
                if (dif <= 4 ||
                    this.compare_array(e.sort((a, b) => a - b), [2, 3, 14]) ||
                    this.compare_array(e.sort((a, b) => a - b), [2, 4, 14]) ||
                    this.compare_array(e.sort((a, b) => a - b), [2, 5, 14]) ||
                    this.compare_array(e.sort((a, b) => a - b), [3, 4, 14]) ||
                    this.compare_array(e.sort((a, b) => a - b), [3, 5, 14]) ||
                    this.compare_array(e.sort((a, b) => a - b), [4, 5, 14])) {
                    this.straightdraw.push('backdoor straight draw')
                }
            })

        }
    }

}

const OppRange = class extends Hand {
    constructor() {
        super();
        this.makeTable();
        this.changeColor();
        this.openRaise();
        this.color();
    }

    makeTable = () => {
        $('#oppRange').html('')
        const num_array = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2']
        for (let i = 0; i < 13; i++) {
            $('#oppRange').append(`<tr id="r${i}"></tr>`)
            for (let j = 0; j < 13; j++) {
                if (i < j) {
                    $(`#r${i}`).append(`<td>${num_array[i]}${num_array[j]}s</td>`)
                } else if (i > j) {
                    $(`#r${i}`).append(`<td>${num_array[j]}${num_array[i]}o</td>`)
                } else {
                    $(`#r${i}`).append(`<td>${num_array[j]}${num_array[i]}</td>`)
                }
            }
        }
    }
    //マウスドラッグで色を塗る
    changeColor = () => {
        let is_drag = false;
        //マウスダウン時フラグオン
        $('#oppRange').on('mousedown', function () {
            is_drag = true;
        })
        //マウスアップ時とマウスが範囲外に行ったときフラグオフ
        $('#oppRange').on('mouseup mouseleave', function () {
            is_drag = false;
        })

        $('#oppRange').on('mousemove', function () {
            if (is_drag === true) {
                //ドラッグ時ホバー発火
                $("#oppRange td").hover(function () {
                    $(this).css("background-color", "#FFFF99");
                });
            } else {
                //フラグオフ時ホバー解除
                $('#oppRange td').off('mouseenter mouseleave');
            }
        });
        //クリックで色解除
        $("#oppRange td").on('click', function () {
            $(this).css("background-color", "");
        });

    }

    openRaise = () => {
        let radio = $('input[name="position"]:checked').val()
        if (radio === 'EP') {
            this.presetRange = ['ATo+', 'KJo+', '55+', 'A2s+', 'K8s+', 'Q9s+', 'J9s+', 'T9s+', '98s', '87s', '76s', '65s']
        }
        if (radio === 'HJ') {
            this.presetRange = ['ATo+', 'KJo+', 'QJo+', '33+', 'A2s+', 'K7s+', 'Q9s+', 'J9s+', 'T8s+', '98s', '87s', '76s', '65s', '54s', '43s']
        }
        if (radio === 'CO') {
            this.presetRange = ['A7o+', 'KTo+', 'QTo+', 'JTo+', '22+', 'A2s+', 'K3s+', 'Q6s+', 'J7s+', 'T7s+', '97s+', '86s+', '76s', '65s', '54s', '43s']
        }
        if (radio === 'BTN') {
            this.presetRange = ['A2o+', 'K8o+', 'Q9o+', 'J8o+', 'T8o+', '98o', '22+', 'A2s+', 'K2s+', 'Q2s+', 'J4s+', 'T6s+', '96s+', '85s+', '75s+', '63s+', '53s+', '43s']
        }
        $('#custom').val(this.presetRange.join(','))
    }

    //ポジションによるハンドレンジを色塗り
    color = () => {
        const num_array = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2']
        this.handRange = $('#custom').val().split(',')
        let target = []
        this.handRange.forEach(element => {
            //A2o+, KTs+などの場合
            if (element.length == 4 & element.substr(3) == '+') {
                switch (element.substr(2, 1)) {
                    case 'o':
                        for (let i = num_array.findIndex((e) => e == element.substr(1, 1)); i > num_array.findIndex((e) => e == element.substr(0, 1)); i--) {
                            target.push(`${element.substr(0, 1)}${num_array[i]}o`)
                        }
                        break;

                    case 's':
                        for (let i = num_array.findIndex((e) => e == element.substr(1, 1)); i > num_array.findIndex((e) => e == element.substr(0, 1)); i--) {
                            target.push(`${element.substr(0, 1)}${num_array[i]}s`)
                        }
                        break;
                }
            } else if (element.length == 3) {
                //33+などの場合
                if (element.substr(2) == '+') {
                    for (let i = num_array.findIndex((e) => e == element.substr(0, 1)); i >= 0; i--) {
                        target.push(`${num_array[i]}${num_array[i]}`)
                    }
                } else {
                    //KQsなどの場合    
                    target.push(element)
                }
            } else if (element.length == 2) {
                //TTなどの場合    
                target.push(element)
            }
        });

        //一旦全てのtdのカラーをリセット
        $('#oppRange td').each((a, b) => {
            $(b).css("background-color", "");
        });

        //ハンドレンジに含まれるtdのみ色塗り
        $('#oppRange td').each((a, b) => {
            if (target.includes($(b).text())) {
                $(b).css("background-color", "#FFFF99");
            }
        });
    }

    //レンジ表を配列に変換
    getHandRange = () => {
        //レンジ表の値を全て取得
        let d = [];
        $('#oppRange tr').each((i, e) => {
            let dd = [];
            $(e).find('td').each((j, el) => {
                if ($(el).css('background-color') == 'rgb(255, 255, 153)') {
                    dd.push($(el).text())
                }
            });
            d.push(dd);
        });
        //二次元配列から一次元配列に変換
        this.oppRange = d.flat()
        //スーツの情報を削除
        let nOppRange = []
        this.oppRange.forEach((e) => {
            nOppRange.push(e.substr(0, 2))
        })
        //重複削除
        nOppRange = Array.from(new Set(nOppRange))
        this.nOppRange = []
        //["AA", ...] ⇒ [["A","A"], ...]]
        nOppRange.forEach((e) => { this.nOppRange.push(e.split("")) })
    }

    check_oppHand = (nOppRange, comu_card, player_hand) => {
        this.oppHand = []
        //ストレート、ペア系の判定処理
        nOppRange.forEach((nOppCards) => {
            //見えているカードと合わせて同じ数字が5枚以上になる場合、処理をスキップ
            const check_cards = nOppCards.concat(player_hand).concat(comu_card)
            const check_num_array = check_cards.map((e) => this.num_list.findIndex((ele) => ele == e.substr(0, 1)) + 2)
            //各数字の出現回数
            let check_num_counts = {}
            check_num_array.forEach(element => {
                check_num_counts[element] = (check_num_counts[element]) ? check_num_counts[element] + 1 : 1;
            });
            const check_rnum = check_num_array.map((e) => check_num_counts[e])
            const available_cards = nOppCards.concat(comu_card)

            if (Math.max(...check_rnum) < 5) {
                let rank_array = []
                let score_array = []
                const hands_combo = combination(available_cards, 5)
                hands_combo.forEach((hand) => {
                    const num_array = hand.map((e) => this.num_list.findIndex((ele) => ele == e.substr(0, 1)) + 2)

                    //各数字の出現回数
                    let num_counts = {}
                    num_array.forEach(element => {
                        num_counts[element] = (num_counts[element]) ? num_counts[element] + 1 : 1;
                    });

                    const rnum = num_array.map((e) => num_counts[e])
                    const dif = Math.max(...num_array) - Math.min(...num_array)
                    let rank, score
                    //ペア系、ストレート系判定
                    if (Math.max(...rnum) == 4) {
                        rank = 'four card'
                        score = this.check_fourcard(num_array, rnum)
                    } else if (this.compare_array(rnum.slice().sort((a, b) => a - b), [2, 2, 3, 3, 3])) {
                        rank = 'fullhouse'
                        score = this.check_fullhouse(num_array, rnum)
                    } else if (Math.max(...rnum) == 3) {
                        rank = 'three card'
                        score = this.check_threecard(num_array, rnum)
                    } else if (this.count_pair(rnum) == 4) {
                        rank = 'two pair'
                        score = this.check_twopair(num_array, rnum)
                    } else if (this.count_pair(rnum) == 2) {
                        rank = 'one pair'
                        score = this.check_onepair(num_array, rnum)
                    } else if (dif == 4 && Math.max(...rnum) == 1) {
                        rank = 'straight'
                        score = 60 + Math.max(...num_array)
                    } else if (this.compare_array(num_array.sort((a, b) => a - b), [2, 3, 4, 5, 14])) {
                        rank = 'straight'
                        score = 65
                    } else {
                        rank = 'high card'
                        num_array.sort((a, b) => a - b)
                        score = num_array[4] + num_array[3] / 100 + num_array[2] / 1000 + num_array[1] / 10000 + num_array[0] / 100000
                    }
                    rank_array.push(rank)
                    score_array.push(score)

                    //ストレートドローの判定
                    if (available_cards.length != 7) {
                        this.check_straightdraw(available_cards)
                    }
                })

                //最大スコアの役を成立役とする
                let index = 0
                let value = 0
                for (let i = 0; i < score_array.length; i++) {
                    if (value < score_array[i]) {
                        value = score_array[i]
                        index = i
                    }
                }
                let hand_info = {}
                hand_info['hand'] = `${nOppCards[0]}${nOppCards[1]}`
                hand_info['rank'] = rank_array[index]
                hand_info['score'] = score_array[index].toFixed(2)

                if (rank_array[index] != 'straight') {
                    hand_info['straightdraw'] = this.straightdraw
                }
                this.oppHand.push(hand_info)
            }
        })

    }

    //コンボ数の計算（ストレート、ペア系のみ）
    countCombo = (showncards) => {
        let deck = make_deck()
        //残りのデッキ
        this.deck = [...new Set([...new Set(deck)].filter(e => (!new Set(showncards).has(e))))]
        let card_count = {}
        //デッキに各数字が何枚残っているか
        this.num_list.forEach((num) => {
            card_count[num] = 0
        })
        //{2: 4, 3: 4,..., A: 2}
        this.deck.forEach((card) => {
            card_count[card.substr(0, 1)] += 1
        })
        this.oppHand.forEach((e) => {
            let first = e['hand'].substr(0, 1)
            let second = e['hand'].substr(1, 1)
            //ポケットペアの場合
            if (first == second) {
                e['combo'] = card_count[first] * (card_count[first] - 1) / 2 //nC2
            } else {
                //相手のレンジにオフスーツが含まれる場合（自動的にスーテッドも含まれる）
                if (this.oppRange.includes(`${e['hand']}o`)) {
                    e['combo'] = card_count[first] * card_count[second]
                } else {
                    //スーテッドのみの場合
                    e['combo'] = 0
                    if (this.deck.includes(`${first}s`) && this.deck.includes(`${second}s`)) { e['combo'] += 1 }
                    if (this.deck.includes(`${first}h`) && this.deck.includes(`${second}h`)) { e['combo'] += 1 }
                    if (this.deck.includes(`${first}d`) && this.deck.includes(`${second}d`)) { e['combo'] += 1 }
                    if (this.deck.includes(`${first}c`) && this.deck.includes(`${second}c`)) { e['combo'] += 1 }
                }
            }
        })
    }

    //コンボ数の計算（フラッシュ系）
    check_flushCombo = (comu_card) => {
        this.flush_combo = 0
        this.flushdraw_combo = 0
        this.backdoorflush_combo = 0
        this.hand_count = 0
        this.isRoyalFlush = 0
        this.isStraightFlush = 0
        this.isStraight = 0
        this.isThreeCard = 0
        this.isTwoPair = 0
        this.isOnePair = 0
        this.isHighCard = 0
        const hand_array = combination(this.deck, 2)
        hand_array.forEach((hand) => {
            let include = false
            //[2, 3]のように1つ目の数字より2つ目の数字が大きい場合は順番を入れ替える
            if (this.num_list.findIndex((ele) => ele == hand[0].substr(0, 1)) < this.num_list.findIndex((ele) => ele == hand[1].substr(0, 1))) {
                hand.reverse()
            }

            //そのハンドが相手のレンジに含まれるかを判定
            if (hand[0].substr(1, 1) == hand[1].substr(1, 1)) {
                //スーテッド
                include = this.oppRange.includes(`${hand[0].substr(0, 1)}${hand[1].substr(0, 1)}s`)
            } else if (hand[0].substr(0, 1) == hand[1].substr(0, 1)) {
                //ポケットペア
                include = this.oppRange.includes(`${hand[0].substr(0, 1)}${hand[0].substr(0, 1)}`)
            } else {
                //オフスーツ
                include = this.oppRange.includes(`${hand[0].substr(0, 1)}${hand[1].substr(0, 1)}o`)
            }
            const available_cards = hand.concat(comu_card)
            if (include) {
                this.check_flushdraw(available_cards)
                if (this.flushdraw == 'flush') {
                    //計算量の観点から、フラッシュと判定されたもののみ、数字のみでの役判定を行い、正確なコンボ数と役判定を行う
                    let rank_array = []
                    let score_array = []
                    const hands_combo = combination(available_cards, 5)
                    hands_combo.forEach((hand) => {
                        const num_array = hand.map((e) => this.num_list.findIndex((ele) => ele == e.substr(0, 1)) + 2)

                        //各数字の出現回数
                        let num_counts = {}
                        num_array.forEach(element => {
                            num_counts[element] = (num_counts[element]) ? num_counts[element] + 1 : 1;
                        });

                        const rnum = num_array.map((e) => num_counts[e])
                        const dif = Math.max(...num_array) - Math.min(...num_array)
                        let rank, score
                        //ペア系、ストレート系判定
                        if (num_array.sort((a, b) => a - b) == [10, 11, 12, 13, 14]) {
                            rank = 'royalflush'
                            score = 135
                        } else if (Math.max(...rnum) == 4) {
                            rank = 'four card'
                            score = this.check_fourcard(num_array, rnum)
                        } else if (this.compare_array(rnum.slice().sort((a, b) => a - b), [2, 2, 3, 3, 3])) {
                            rank = 'fullhouse'
                            score = this.check_fullhouse(num_array, rnum)
                        } else if (Math.max(...rnum) == 3) {
                            rank = 'three card'
                            score = this.check_threecard(num_array, rnum)
                        } else if (this.count_pair(rnum) == 4) {
                            rank = 'two pair'
                            score = this.check_twopair(num_array, rnum)
                        } else if (this.count_pair(rnum) == 2) {
                            rank = 'one pair'
                            score = this.check_onepair(num_array, rnum)
                        } else if (dif == 4 && Math.max(...rnum) == 1) {
                            rank = 'straight'
                            score = 60 + Math.max(...num_array)
                        } else if (this.compare_array(num_array.sort((a, b) => a - b), [2, 3, 4, 5, 14])) {
                            rank = 'straight'
                            score = 65
                        } else {
                            rank = 'high card'
                            num_array.sort((a, b) => a - b)
                            score = num_array[4] + num_array[3] / 100 + num_array[2] / 1000 + num_array[1] / 10000 + num_array[0] / 100000
                        }
                        rank_array.push(rank)
                        score_array.push(score.toFixed(2))
                    })

                    let index = 0
                    let value = 0
                    for (let i = 0; i < score_array.length; i++) {
                        if (value < score_array[i]) {
                            value = score_array[i]
                            index = i
                        }
                    }
                    switch (rank_array[index]) {
                        case 'royal flush':
                            //後でストレートのコンボ数から実際はロイヤルフラッシュであるコンボ数を差し引く
                            this.isStraight -= 1
                            this.isRoyalFlush += 1
                            break;
                        case 'straight':
                            this.isStraight -= 1
                            this.isStraightFlush += 1
                            break;
                        case 'three card':
                            this.isThreeCard -= 1
                            this.flush_combo += 1
                            break;
                        case 'two pair':
                            this.isTwoPair -= 1
                            this.flush_combo += 1
                            break;
                        case 'one pair':
                            this.isOnePair -= 1
                            this.flush_combo += 1
                            break;
                        case 'high card':
                            this.isHighCard -= 1
                            this.flush_combo += 1
                            break;
                        default:
                            //フォーカード、フルハウスはフラッシュより強いのでそのまま
                            break;
                    }
                } else if (this.flushdraw == 'flush draw') {
                    this.flushdraw_combo += 1
                } else if (this.flushdraw == 'backdoor flush draw') {
                    this.backdoorflush_combo += 1
                }
                this.hand_count += 1
            }
        })

    }

    arrangeOppHand = () => {
        this.oppCombo = {
            'high card': 0, 'one pair': 0, 'two pair': 0, 'three card': 0, 'straight': 0, 'fullhouse': 0, 'four card': 0,
            'openend straight draw': 0, 'gutshot straight draw': 0, 'backdoor straight draw': 0
        }
        this.oppHand.forEach((hand_info) => {
            this.oppCombo[hand_info['rank']] += hand_info['combo']

            if (hand_info['straightdraw'] != undefined) {
                if (hand_info['straightdraw'].includes('openend straight draw')) {
                    this.oppCombo['openend straight draw'] += hand_info['combo']
                }
                if (hand_info['straightdraw'].includes('gutshot straight draw')) {
                    this.oppCombo['gutshot straight draw'] += hand_info['combo']
                }
                if (hand_info['straightdraw'].includes('backdoor straight draw')) {
                    this.oppCombo['backdoor straight draw'] += hand_info['combo']
                }
            }
        })
        this.oppCombo['royal flush'] = this.isRoyalFlush
        this.oppCombo['straight flush'] = this.isStraightFlush
        this.oppCombo['straight'] = this.oppCombo['straight'] + this.isStraight
        this.oppCombo['three card'] = this.oppCombo['three card'] + this.isThreeCard
        this.oppCombo['two pair'] = this.oppCombo['two pair'] + this.isTwoPair
        this.oppCombo['one pair'] = this.oppCombo['one pair'] + this.isOnePair
        this.oppCombo['high card'] = this.oppCombo['high card'] + this.isHighCard
        this.oppCombo['flush'] = this.flush_combo
        this.oppCombo['flush draw'] = this.flushdraw_combo
        this.oppCombo['backdoor flush draw'] = this.backdoorflush_combo
    }
}

//52枚のトランプを作成
const make_deck = () => {
    let deck = []
    const num_list = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A']
    const suit_list = ['s', 'h', 'd', 'c']
    num_list.forEach(num => {
        suit_list.forEach(suit => {
            deck.push(num + suit)
        });
    });
    return deck
}

const or = new OppRange
$("#display").on('click', or.color)
$('input[name="position"]:radio').change(() => {
    or.openRaise()
    or.color()
})

let deck = make_deck()
let player_hand = []
let comu_card = []

$("#start").on('click', () => {
    player_hand = [$('#myhand1').val(), $('#myhand2').val()]
    comu_card = [$('#flop1').val(), $('#flop2').val(), $('#flop3').val(), $('#turn').val(), $('#river').val()]
    const available_cards = player_hand.concat(comu_card);

    //デッキから見えているカードを抜く
    deck = [...new Set([...new Set(deck)].filter(e => (!new Set(available_cards).has(e))))]

    //未入力の場合、ランダムで自分の手札、フロップ、ターン、リバーカードを表示
    let card = []
    switch ($('#start').text()) {
        case 'スタート':
            if ($('#myhand1').val() == "") {
                card = randomSelect(deck, 1)
                $('#myhand1').val(card)
            }
            if ($('#myhand2').val() == "") {
                card = randomSelect(deck, 1)
                $('#myhand2').val(card)
            }
            $('#start').text('フロップ')
            break;
        case 'フロップ':
            if ($('#flop1').val() == "") {
                card = randomSelect(deck, 1)
                $('#flop1').val(card)
            }
            if ($('#flop2').val() == "") {
                card = randomSelect(deck, 1)
                $('#flop2').val(card)
            }
            if ($('#flop3').val() == "") {
                card = randomSelect(deck, 1)
                $('#flop3').val(card)
            }
            $('#start').text('ターン')
            break;
        case 'ターン':
            if ($('#turn').val() == "") {
                card = randomSelect(deck, 1)
                $('#turn').val(card)
            }
            $('#start').text('リバー')
            break;
        case 'リバー':
            if ($('#river').val() == "") {
                card = randomSelect(deck, 1)
                $('#river').val(card)
            }
            $('#start').text('リスタート')
            break;
        case 'リスタート':
            $('#myhand1').val("")
            $('#myhand2').val("")
            $('#flop1').val("")
            $('#flop2').val("")
            $('#flop3').val("")
            $('#turn').val("")
            $('#river').val("")
            $('#start').text('スタート')

            deck = make_deck()
            break;
    }


});

$("#showCombo").on('click', () => {
    //役とドローの判定

    deck = make_deck()
    player_hand = [$('#myhand1').val(), $('#myhand2').val()]
    comu_card = [$('#flop1').val(), $('#flop2').val(), $('#flop3').val(), $('#turn').val(), $('#river').val()]
    //未入力部分を除く
    comu_card = comu_card.filter((e) => { return e != ""; })
    const available_cards = player_hand.concat(comu_card);

    if (available_cards.length >= 5) {
        //役の判定
        const h = new Hand
        h.check_hand(available_cards)
        $('#result').html(`<h4>自分の手役</h4>HAND:<br><li>${h.rank}`)

        if (available_cards.length != 7) {
            $('#result').append('<br>DRAW: <br>')
            // フラッシュドローの判定
            h.check_flushdraw(available_cards)
            const flushdraw = h.flushdraw
            if (flushdraw != "" && flushdraw != 'flush') {
                $('#result').append(`<li>${flushdraw}`)
            }
            //ストレートドローの判定
            h.check_straightdraw(available_cards)
            const straightdraw = h.straightdraw
            if (straightdraw.length != 0) {
                straightdraw.forEach((e) => {
                    $('#result').append(`<li>${e}`)
                })
            }
        }

        //相手のハンドレンジから役の分布を計算
        or.getHandRange()
        or.check_oppHand(or.nOppRange, comu_card, player_hand)
        or.countCombo(available_cards);
        or.check_flushCombo(comu_card);
        or.arrangeOppHand()
        console.log(or.oppHand);

        $('#oppResult').html(`<h4>相手の手役</h4>HAND:<br>`)
        if (or.oppCombo['royal flush'] > 0) {
            $('#oppResult').append(`<li>royal flush: ${or.oppCombo['royal flush']}コンボ（${(or.oppCombo['royal flush'] / or.hand_count * 100).toFixed(2)}%）<br>`)
        }
        if (or.oppCombo['straight flush'] > 0) {
            $('#oppResult').append(`<li>straight flush: ${or.oppCombo['straight flush']}コンボ（${(or.oppCombo['straight flush'] / or.hand_count * 100).toFixed(2)}%）<br>`)
        }
        if (or.oppCombo['four card'] > 0) {
            $('#oppResult').append(`<li>four card: ${or.oppCombo['four card']}コンボ（${(or.oppCombo['four card'] / or.hand_count * 100).toFixed(2)}%）<br>`)
        }
        if (or.oppCombo['fullhouse'] > 0) {
            $('#oppResult').append(`<li>fullhouse: ${or.oppCombo['fullhouse']}コンボ（${(or.oppCombo['fullhouse'] / or.hand_count * 100).toFixed(2)}%）<br>`)
        }
        if (or.oppCombo['flush'] > 0) {
            $('#oppResult').append(`<li>flush: ${or.oppCombo['flush']}コンボ（${(or.oppCombo['flush'] / or.hand_count * 100).toFixed(2)}%）<br>`)
        }
        if (or.oppCombo['straight'] > 0) {
            $('#oppResult').append(`<li>straight: ${or.oppCombo['straight']}コンボ（${(or.oppCombo['straight'] / or.hand_count * 100).toFixed(2)}%）<br>`)
        }
        if (or.oppCombo['three card'] > 0) {
            $('#oppResult').append(`<li>three card: ${or.oppCombo['three card']}コンボ（${(or.oppCombo['three card'] / or.hand_count * 100).toFixed(2)}%）<br>`)
        }
        if (or.oppCombo['two pair'] > 0) {
            $('#oppResult').append(`<li>two pair: ${or.oppCombo['two pair']}コンボ（${(or.oppCombo['two pair'] / or.hand_count * 100).toFixed(2)}%）<br>`)
        }
        if (or.oppCombo['one pair'] > 0) {
            $('#oppResult').append(`<li>one pair: ${or.oppCombo['one pair']}コンボ（${(or.oppCombo['one pair'] / or.hand_count * 100).toFixed(2)}%）<br>`)
        }
        if (or.oppCombo['high card'] > 0) {
            $('#oppResult').append(`<li>high card: ${or.oppCombo['high card']}コンボ（${(or.oppCombo['high card'] / or.hand_count * 100).toFixed(2)}%）<br>`)
        }
        if (comu_card.length != 5) {
            $('#oppResult').append('<br>DRAW: <br>')
        }
        if (or.oppCombo['openend straight draw'] > 0 && available_cards.length <= 6) {
            $('#oppResult').append(`<li>openend straight draw: ${or.oppCombo['openend straight draw']}コンボ（${(or.oppCombo['openend straight draw'] / or.hand_count * 100).toFixed(2)}%）<br>`)
        }
        if (or.oppCombo['gutshot straight draw'] > 0 && available_cards.length <= 6) {
            $('#oppResult').append(`<li>gutshot straight draw: ${or.oppCombo['gutshot straight draw']}コンボ（${(or.oppCombo['gutshot straight draw'] / or.hand_count * 100).toFixed(2)}%）<br>`)
        }
        if (or.oppCombo['backdoor straight draw'] > 0 && available_cards.length == 5) {
            $('#oppResult').append(`<li>backdoor straight draw: ${or.oppCombo['backdoor straight draw']}コンボ（${(or.oppCombo['backdoor straight draw'] / or.hand_count * 100).toFixed(2)}%）<br>`)
        }
        if (or.oppCombo['flush draw'] > 0) {
            $('#oppResult').append(`<li>flush draw: ${or.oppCombo['flush draw']}コンボ（${(or.oppCombo['flush draw'] / or.hand_count * 100).toFixed(2)}%）<br>`)
        }
        if (or.oppCombo['backdoor flush draw'] > 0) {
            $('#oppResult').append(`<li>backdoor flush draw: ${or.oppCombo['backdoor flush draw']}コンボ（${(or.oppCombo['backdoor flush draw'] / or.hand_count * 100).toFixed(2)}%）<br>`)
        }
    }
})

const combination = (nums, k) => {
    let ans = [];
    if (nums.length < k) {
        return []
    }
    if (k === 1) {
        for (let i = 0; i < nums.length; i++) {
            ans[i] = [nums[i]];
        }
    } else {
        for (let i = 0; i < nums.length - k + 1; i++) {
            let row = combination(nums.slice(i + 1), k - 1);
            for (let j = 0; j < row.length; j++) {
                ans.push([nums[i]].concat(row[j]));
            }
        }
    }
    return ans;
}

const randomSelect = (array, num) => {
    let newArray = [];
    while (newArray.length < num && array.length > 0) {
        // 配列からランダムな要素を選ぶ
        const rand = Math.floor(Math.random() * array.length);
        // 選んだ要素を別の配列に登録する
        newArray.push(array[rand]);
        // もとの配列からは削除する
        array.splice(rand, 1);
    }
    return newArray
}