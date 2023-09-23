import{_ as e,o as i,c as a,e as p}from"./app-91f40cf0.js";const r={},l=p('<h2 id="功率限制" tabindex="-1"><a class="header-anchor" href="#功率限制" aria-hidden="true">#</a> 功率限制</h2><ul><li><p>寝室总功率限制为 500W</p></li><li><p>寝室内单个用电设备不能超过 100W。</p></li><li><p>超过限制后会立即断电，3 分钟之后恢复供电，断电四次以后不能自动恢复需人工介入。</p></li></ul><div class="hint-container info"><p class="hint-container-title">相关信息</p><p>学校先前公开相关数据的页面已经失效，目前 Mr.Hope 尚未找到新的相关文件或说明，学校相关部门也拒绝做出解释。</p></div><h2 id="mr-hope-の-解释" tabindex="-1"><a class="header-anchor" href="#mr-hope-の-解释" aria-hidden="true">#</a> Mr.Hope の 解释</h2><ul><li><p>目前学校先前公开相关数据的页面已经失效，从实际体验来讲，跳闸的总功率应该在 800W - 1000W 左右。</p></li><li><p>单个电器的功率检测限制应该是通过软件得出的，换而言之单独控制每个寝室的电子开关都自带一个功率计，功率计会以一定频率 (大概 20 - 100 次每分) 的频率更新自己的示数，并将数据回传。如果短时间内功率增大数值超过后台的设定值 (应该在 110W - 220W 之间，需要考虑电子功率计自己本身也有一定误差)，就会触发跳闸。换而言之，接入 110W 及以上的开关式的电器 (如一个 150W 的加热器，大概率会触发跳闸)</p></li><li><p>请注意，多次断电一旦锁死，计电办的工作人员不能直接给您恢复供电。这会导致您面临一个重要的问题: 如何证明自己跳闸不是因为自己违规用电。如果因为灯管短路或插座短接，存在相关的维修记录，情况还算简单。否则虽然学校在没有证据的情况下不会给您处分，但是会给予您批评教育，毕竟有正当理由怀疑您进行了违规用电操作。</p></li><li><p>如果您是因为使用违章电器导致的寝室跳闸，而且学生处查到了您的违章电器或有他人举报，您将会被给予处分。严重者会被强制退宿，只能住在外面走读，相关材料也会写入您的档案，后果还是挺严重的。</p></li></ul><h3 id="关于笔记本的问题" tabindex="-1"><a class="header-anchor" href="#关于笔记本的问题" aria-hidden="true">#</a> 关于笔记本的问题</h3><p>近期有很多同学向我询问，自己的笔记本适配器功率达到了 150W 以上，担心无法使用。这个大家请不要担心。下面由我来尽量给大家解释一下(文科生还是看不懂的话我也没办法)</p><p>寝室对单个用电器的检测的核心是电流变化，或者说电路上电流的功率变动。只有很短时间内内功率变化过快，才会跳闸。</p><p>对于笔记本来说，变压器的额定功率都会超出笔记本的最大功耗(性能全部拉满 + 充电)，也就是说一个 180W 适配器的本子，全负载工作可能只有 140W，同时充电的情况下才有 160+W。但是笔记本的功耗是很大程度上由笔记本当时的运算量(性能使用比例)决定的。换句话来说，您正常打开机器，笔记本会只有 20W - 30W 左右的功率。随着您打开软件的增多，它的功耗会慢慢上升。如果您进行游戏或使用软件进行复杂计算时，笔记本的运算量通常不会突然之间在几秒之内一下拉到最大值。在打开游戏时，您会经历边载入边渲染的过程，此时 CPU(中央处理器)、GPU(显卡)应该会以 40% 左右的性能运行一段时间，此时以 180W 适配的笔记本为例，功耗通常在 50W - 80W 左右。之后进入游戏游玩时功耗会进一步上升。另外诸如 Matlab 这种运算软件，它并不会充分调用 GPU，而是以 CPU 为主，另外它在开始运算的时候通常需要进行数秒的矩阵装配，写入内存的活动。换言之，一个笔记本电脑在总功率小于 150W 的情况，因为本身待机功耗就有 20W - 30W，在日常使用中也不会出现在 1 秒之内让机器满载的极端情况(甚至是死机，通常也只会拉满单个 CPU 或 GPU)。Mr.Hope 本人使用的笔记本适配器额定功率也为 180W，从未发生过跳闸，所以请大家放心使用。</p><p>另外需要特别注意，适配器功率超过 200W 的笔记本，原则上的确存在在特定使用情况下，功率波动超过 110W 的可能的。至于是否会出现跳闸还有待同学们向我汇报。此外一些手机的诸如 200W 快充黑科技可能也要慎用，如果引发了断电建议立即上报导员说明情况并暂时使用常规充电方式充电。台式机超过 250W 后，会有一定的日常使用运行游戏、程序发生跳闸的概率。</p>',10),t=[l];function n(o,c){return i(),a("div",null,t)}const W=e(r,[["render",n],["__file","power.html.vue"]]);export{W as default};
