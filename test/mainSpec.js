function render(tmpl, data) {
	var f = crox_js(tmpl);
	var strResult = f(data);
	return strResult;
}
describe('变量测试', function() {
	it('变量输出', function() {
		expect(render('{{root.name}}', {
			name: 'a'
		})).to.be('a');


		expect(render(' {{  root.name  }} ', {
			name: 'a'
		})).to.be(' a ');
	});

	it('变量运算', function() {
		expect(render('{{root.value*2}}', {
			value: 'a'
		})).to.be('NaN');

		expect(render('{{root.value*2}}', {
			value: 20
		})).to.be('40');


		expect(render(' {{  root.value*2  }} ', {
			value: 20
		})).to.be(' 40 ');

		expect(render('{{root.value*2}}', {
			value: '20'
		})).to.be('40');

		expect(render('{{root.value*2}}', {
			value: '20a'
		})).to.be('NaN');

		expect(render('{{root.value+2}}', {
			value: '20a'
		})).to.be('20a2');

		expect(render('{{root.value+2}}', {
			value: '20'
		})).to.be('202');

		expect(render('{{root.value+2}}', {
			value: 20
		})).to.be('22');

		expect(render('{{  root.value+root.value  }}', {
			value: 20
		})).to.be('40');
	});

	//...more
});

describe('条件判断', function() {
	it('if语句', function() {
		expect(render('{{#if root.ok}}ok{{/if}}', {
			ok: true
		})).to.be('ok');

		expect(render('{{#if root.ok}}ok{{/if}}', {
			ok: false
		})).to.be('');
	});

	it('if else 语句', function() {
		expect(render('{{#if root.ok}}ok{{else}}err{{/if}}', {
			ok: true
		})).to.be('ok');

		expect(render('{{#if root.ok}}ok{{else}}err{{/if}}', {
			ok: false
		})).to.be('err');
	});
});

describe('循环测试', function() {
	it('each', function() {
		expect(render('{{#each root.arr \'val\'}}val:{{val}}{{/each}}', {
			arr: [1, 2]
		})).to.be('val:1val:2');

		expect(render('{{#each root.arr \'val\' \'key\'}}{{key}}:{{val}}{{/each}}', {
			arr: [1, 2]
		})).to.be('0:11:2');

		expect(render('{{#each root.arr "val"}}val:{{val}}{{/each}}', {
			arr: [1, 2]
		})).to.be('val:1val:2');

		expect(render('{{#each root.arr "val" "key"}}{{key}}:{{val}}{{/each}}', {
			arr: [1, 2]
		})).to.be('0:11:2');
	});
});


describe('赋值测试', function() {
	it('基础', function() {
		expect(render('a{{set a="12"}}{{a}}')).to.be('a12');
		expect(render('a{{set a=12*12}}{{a}}')).to.be('a144');
	});
	it('引用', function() {
		expect(render('a{{set a=root.outer.inner.desc}}{{a}}', {
			outer: {
				inner: {
					desc: 'desc'
				}
			}
		})).to.be('adesc');
	});

	it('异常', function() {
		expect(function() {
			render('a{{set a=12*12;}}{{a}}');
		}).to.throwError();
		expect(function() {
			render('a{{set a={b:12,c:13} }}{{a.b}}{{a.c}}');
		}).to.throwError();

		expect(function() {
			render('{{set $a=12}}{{$a}}').to.be('12');
		}).to.throwError();
	});
});