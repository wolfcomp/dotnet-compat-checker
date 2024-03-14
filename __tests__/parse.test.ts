import parse, { Member, Type, Change } from '../src/parse'

describe('parse', () => {
    it('should parse the result', () => {
        const result = `API compatibility errors between 'ida/cs-main/FFXIVClientStructs.dll' (left) and 'ida/cs-pr/FFXIVClientStructs.dll' (right):
CP0002: Member 'long FFXIVClientStructs.FFXIV.Client.Game.Object.GameObjectManager.<ObjectList3>e__FixedBuffer.FixedElementField' exists on ida/cs-main/FFXIVClientStructs.dll but not on ida/cs-pr/FFXIVClientStructs.dll
CP0002: Member 'long FFXIVClientStructs.FFXIV.Client.Game.Object.GameObjectManager.<ObjectList>e__FixedBuffer.FixedElementField' exists on ida/cs-main/FFXIVClientStructs.dll but not on ida/cs-pr/FFXIVClientStructs.dll
CP0002: Member 'long FFXIVClientStructs.FFXIV.Client.Game.Object.GameObjectManager.<ObjectListFiltered>e__FixedBuffer.FixedElementField' exists on ida/cs-main/FFXIVClientStructs.dll but not on ida/cs-pr/FFXIVClientStructs.dll
CP0001: Type 'FFXIVClientStructs.STD.StdList<T>.Node' exists on ida/cs-main/FFXIVClientStructs.dll but not on ida/cs-pr/FFXIVClientStructs.dll
CP0002: Member 'FFXIVClientStructs.STD.StdList<T>.Node* FFXIVClientStructs.STD.StdList<T>.Head' exists on ida/cs-main/FFXIVClientStructs.dll but not on ida/cs-pr/FFXIVClientStructs.dll
CP0002: Member 'ulong FFXIVClientStructs.STD.StdList<T>.Size' exists on ida/cs-main/FFXIVClientStructs.dll but not on ida/cs-pr/FFXIVClientStructs.dll
CP0001: Type 'FFXIVClientStructs.STD.StdMap<TKey, TValue>.Enumerator' exists on ida/cs-main/FFXIVClientStructs.dll but not on ida/cs-pr/FFXIVClientStructs.dll
CP0001: Type 'FFXIVClientStructs.STD.StdMap<TKey, TValue>.Node' exists on ida/cs-main/FFXIVClientStructs.dll but not on ida/cs-pr/FFXIVClientStructs.dll
CP0002: Member 'FFXIVClientStructs.STD.StdMap<TKey, TValue>.Node* FFXIVClientStructs.STD.StdMap<TKey, TValue>.Head' exists on ida/cs-main/FFXIVClientStructs.dll but not on ida/cs-pr/FFXIVClientStructs.dll
CP0002: Member 'ulong FFXIVClientStructs.STD.StdMap<TKey, TValue>.Count' exists on ida/cs-main/FFXIVClientStructs.dll but not on ida/cs-pr/FFXIVClientStructs.dll
CP0002: Member 'FFXIVClientStructs.STD.StdMap<TKey, TValue>.Node* FFXIVClientStructs.STD.StdMap<TKey, TValue>.SmallestValue.get' exists on ida/cs-main/FFXIVClientStructs.dll but not on ida/cs-pr/FFXIVClientStructs.dll
CP0002: Member 'FFXIVClientStructs.STD.StdMap<TKey, TValue>.Node* FFXIVClientStructs.STD.StdMap<TKey, TValue>.LargestValue.get' exists on ida/cs-main/FFXIVClientStructs.dll but not on ida/cs-pr/FFXIVClientStructs.dll
CP0002: Member 'FFXIVClientStructs.STD.StdMap<TKey, TValue>.Enumerator FFXIVClientStructs.STD.StdMap<TKey, TValue>.GetEnumerator()' exists on ida/cs-main/FFXIVClientStructs.dll but not on ida/cs-pr/FFXIVClientStructs.dll
CP0001: Type 'FFXIVClientStructs.STD.StdSet<TKey>' exists on ida/cs-main/FFXIVClientStructs.dll but not on ida/cs-pr/FFXIVClientStructs.dll
CP0002: Member 'System.ReadOnlySpan<byte> FFXIVClientStructs.STD.StdString.AsSpan()' exists on ida/cs-main/FFXIVClientStructs.dll but not on ida/cs-pr/FFXIVClientStructs.dll
API breaking changes found. If those are intentional, the APICompat suppression file can be updated by specifying the '--generate-suppression-file' parameter.`

        const parseResult = parse(result)

        const expected = [
            {
                obj: new Change(
                    'CP0002:',
                    'Member',
                    new Member(
                        'Client.Game.Object.GameObjectManager',
                        'ObjectList3',
                        'long'
                    ),
                    'exists on ida/cs-main/FFXIVClientStructs.dll but not on ida/cs-pr/FFXIVClientStructs.dll'
                ),
                str: 'long Client.Game.Object.GameObjectManager.ObjectList3'
            },
            {
                obj: new Change(
                    'CP0002:',
                    'Member',
                    new Member(
                        'Client.Game.Object.GameObjectManager',
                        'ObjectList',
                        'long'
                    ),
                    'exists on ida/cs-main/FFXIVClientStructs.dll but not on ida/cs-pr/FFXIVClientStructs.dll'
                ),
                str: 'long Client.Game.Object.GameObjectManager.ObjectList'
            },
            {
                obj: new Change(
                    'CP0002:',
                    'Member',
                    new Member(
                        'Client.Game.Object.GameObjectManager',
                        'ObjectListFiltered',
                        'long'
                    ),
                    'exists on ida/cs-main/FFXIVClientStructs.dll but not on ida/cs-pr/FFXIVClientStructs.dll'
                ),
                str: 'long Client.Game.Object.GameObjectManager.ObjectListFiltered'
            },
            {
                obj: new Change(
                    'CP0001:',
                    'Type',
                    new Type('StdList<T>.Node'),
                    'exists on ida/cs-main/FFXIVClientStructs.dll but not on ida/cs-pr/FFXIVClientStructs.dll'
                ),
                str: 'StdList<T>.Node'
            },
            {
                obj: new Change(
                    'CP0002:',
                    'Member',
                    new Member('StdList<T>', 'Head', 'StdList<T>.Node*'),
                    'exists on ida/cs-main/FFXIVClientStructs.dll but not on ida/cs-pr/FFXIVClientStructs.dll'
                ),
                str: 'StdList<T>.Node* StdList<T>.Head'
            },
            {
                obj: new Change(
                    'CP0002:',
                    'Member',
                    new Member('StdList<T>', 'Size', 'ulong'),
                    'exists on ida/cs-main/FFXIVClientStructs.dll but not on ida/cs-pr/FFXIVClientStructs.dll'
                ),
                str: 'ulong StdList<T>.Size'
            },
            {
                obj: new Change(
                    'CP0001:',
                    'Type',
                    new Type('StdMap<TKey, TValue>.Enumerator'),
                    'exists on ida/cs-main/FFXIVClientStructs.dll but not on ida/cs-pr/FFXIVClientStructs.dll'
                ),
                str: 'StdMap<TKey, TValue>.Enumerator'
            },
            {
                obj: new Change(
                    'CP0001:',
                    'Type',
                    new Type('StdMap<TKey, TValue>.Node'),
                    'exists on ida/cs-main/FFXIVClientStructs.dll but not on ida/cs-pr/FFXIVClientStructs.dll'
                ),
                str: 'StdMap<TKey, TValue>.Node'
            },
            {
                obj: new Change(
                    'CP0002:',
                    'Member',
                    new Member(
                        'StdMap<TKey, TValue>',
                        'Head',
                        'StdMap<TKey, TValue>.Node*'
                    ),
                    'exists on ida/cs-main/FFXIVClientStructs.dll but not on ida/cs-pr/FFXIVClientStructs.dll'
                ),
                str: 'StdMap<TKey, TValue>.Node* StdMap<TKey, TValue>.Head'
            },
            {
                obj: new Change(
                    'CP0002:',
                    'Member',
                    new Member('StdMap<TKey, TValue>', 'Count', 'ulong'),
                    'exists on ida/cs-main/FFXIVClientStructs.dll but not on ida/cs-pr/FFXIVClientStructs.dll'
                ),
                str: 'ulong StdMap<TKey, TValue>.Count'
            },
            {
                obj: new Change(
                    'CP0002:',
                    'Member',
                    new Member(
                        'StdMap<TKey, TValue>',
                        'SmallestValue.get',
                        'StdMap<TKey, TValue>.Node*'
                    ),
                    'exists on ida/cs-main/FFXIVClientStructs.dll but not on ida/cs-pr/FFXIVClientStructs.dll'
                ),
                str: 'StdMap<TKey, TValue>.Node* StdMap<TKey, TValue>.SmallestValue.get'
            },
            {
                obj: new Change(
                    'CP0002:',
                    'Member',
                    new Member(
                        'StdMap<TKey, TValue>',
                        'LargestValue.get',
                        'StdMap<TKey, TValue>.Node*'
                    ),
                    'exists on ida/cs-main/FFXIVClientStructs.dll but not on ida/cs-pr/FFXIVClientStructs.dll'
                ),
                str: 'StdMap<TKey, TValue>.Node* StdMap<TKey, TValue>.LargestValue.get'
            },
            {
                obj: new Change(
                    'CP0002:',
                    'Member',
                    new Member(
                        'StdMap<TKey, TValue>',
                        'GetEnumerator()',
                        'StdMap<TKey, TValue>.Enumerator'
                    ),
                    'exists on ida/cs-main/FFXIVClientStructs.dll but not on ida/cs-pr/FFXIVClientStructs.dll'
                ),
                str: 'StdMap<TKey, TValue>.Enumerator StdMap<TKey, TValue>.GetEnumerator()'
            },
            {
                obj: new Change(
                    'CP0001:',
                    'Type',
                    new Type('StdSet<TKey>'),
                    'exists on ida/cs-main/FFXIVClientStructs.dll but not on ida/cs-pr/FFXIVClientStructs.dll'
                ),
                str: 'StdSet<TKey>'
            },
            {
                obj: new Change(
                    'CP0002:',
                    'Member',
                    new Member(
                        'StdString',
                        'AsSpan()',
                        'System.ReadOnlySpan<byte>'
                    ),
                    'exists on ida/cs-main/FFXIVClientStructs.dll but not on ida/cs-pr/FFXIVClientStructs.dll'
                ),
                str: 'System.ReadOnlySpan<byte> StdString.AsSpan()'
            }
        ]

        expect(parseResult).toHaveLength(expected.length)

        for (let i = 0; i < parseResult.length; i++) {
            const parsed = parseResult[i]
            const obj = expected[i]
            expect(parsed).toEqual(obj.obj)
            expect(parsed.field.toString()).toEqual(obj.str)
        }
    })
})
