import { MockItem } from './interface';
import Mock from 'mockjs';
import user from './user';
import monitor from './monitor';
import dispatch from './dispatch';

Mock.setup({
    timeout: 1000
})

const mocks: MockItem[] = [
    ...user,
    ...monitor,
    ...dispatch
]

for (const i of mocks) {
    Mock.mock(new RegExp(i.url), i.type, i.response);
}