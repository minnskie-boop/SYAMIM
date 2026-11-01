import test from 'node:test';
import assert from 'node:assert/strict';
import { generateQuestionForStage } from './dskpQuestions';

test('Stage 1 generates valid Triangle or Parallelogram questions', () => {
  for (let i = 0; i < 15; i++) {
    const q = generateQuestionForStage(1);
    assert.ok(q.topic === 'Segi Tiga' || q.topic === 'Segi Empat Selari');
    assert.equal(q.options.length, 4);

    const correctOpts = q.options.filter((o) => o.isCorrect);
    assert.equal(correctOpts.length, 1);
    assert.ok(typeof correctOpts[0].value === 'number');
    assert.ok(correctOpts[0].value > 0);
  }
});

test('Stage 3 generates valid Kite or Trapezium questions', () => {
  for (let i = 0; i < 15; i++) {
    const q = generateQuestionForStage(3);
    assert.ok(q.topic === 'Lelayang' || q.topic === 'Trapezium');
    assert.equal(q.options.length, 4);

    const correctOpts = q.options.filter((o) => o.isCorrect);
    assert.equal(correctOpts.length, 1);
    assert.ok(typeof correctOpts[0].value === 'number');
    assert.ok(correctOpts[0].value > 0);
  }
});

test('Stage 5 generates valid Compound Shape and KBAT questions', () => {
  for (let i = 0; i < 15; i++) {
    const q = generateQuestionForStage(5);
    assert.ok(q.topic === 'Gabungan Bentuk' || q.topic === 'Trapezium');
    assert.equal(q.options.length, 4);

    const correctOpts = q.options.filter((o) => o.isCorrect);
    assert.equal(correctOpts.length, 1);
    assert.ok(typeof correctOpts[0].value === 'number');
    assert.ok(correctOpts[0].value > 0);
  }
});
