export default function parse(result: string): Change[] {
    /* Breaking changes has the format of 
    API compatibility errors between 'ida/cs-main/FFXIVClientStructs.dll' (left) and 'ida/cs-pr/FFXIVClientStructs.dll' (right):
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
    API breaking changes found. If those are intentional, the APICompat suppression file can be updated by specifying the '--generate-suppression-file' parameter.
     */
    const lines = result.split('\n')
    const breakingChanges = lines.filter(line => line.startsWith('CP'))
    return breakingChanges.map(parseObject)
}

function parseObject(line: string): Change {
    const member = cleanType(line.split("'")[1]).split(' ')
    const parts = line.split("'")[0].split(' ').concat(line.split("'").slice(2))
    const changeType = parts[0]
    const type = parts[1]
    const field = parseFromChangeType(changeType, member)
    const message = parts.slice(3).join(' ').trim()
    return new Change(changeType, type, field, message)
}

function parseFromChangeType(changeType: string, member: string[]): Type {
    if (changeType === 'CP0001:') {
        return parseType(member)
    } else {
        return parseMember(member)
    }
}

function parseType(member: string[]): Type {
    return new Type(member[0].replaceAll(',', ', '))
}

function parseMember(member: string[]): Member {
    const type = member[0]
    const parts = member[1].split('.')
    let object = parts.slice(0, parts.length - 1).join('.')
    let field = parts[parts.length - 1].replace('<', '').replace('>', '')
    if (field === 'get') {
        object = parts.slice(0, parts.length - 2).join('.')
        field = parts
            .slice(parts.length - 2)
            .join('.')
            .replace('<', '')
            .replace('>', '')
    }
    return new Member(
        object.replaceAll(',', ', '),
        field.replaceAll(',', ', '),
        type.replaceAll(',', ', ')
    )
}

function cleanType(name: string): string {
    return name
        .replaceAll('FFXIVClientStructs.FFXIV.', '')
        .replace('e__FixedBuffer.FixedElementField', '')
        .replaceAll('FFXIVClientStructs.STD.', '')
        .replaceAll(', ', ',')
}

export class Change {
    changeType: string
    type: string
    field: Type
    message: string

    constructor(
        changeType: string,
        type: string,
        field: Type,
        message: string
    ) {
        this.changeType = changeType
        this.type = type
        this.field = field
        this.message = message
    }
}

export class Type {
    object: string

    constructor(object: string) {
        this.object = object
    }

    toString(): string {
        return this.object
    }
}

export class Member extends Type {
    field: string
    type: string

    constructor(object: string, field: string, type: string) {
        super(object)
        this.field = field
        this.type = type
    }

    toString(): string {
        return `${this.type} ${this.object}.${this.field}`
    }
}
