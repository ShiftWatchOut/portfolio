import Head from 'next/head'

class FamilyNode {
  personId = ''
  fatherId = ''
  motherId = ''
  static from(personId, fatherId = '', motherId = '') {
    if (!personId) {
      throw '节点 ID 不能为空'
    }
    const node = new FamilyNode()
    node.personId = personId
    node.fatherId = fatherId
    node.motherId = motherId
    return node
  }
}

class TreeNode {
  nodeId = ''
  /** @type {Array<TreeNode>} */
  children = []
  static from(nodeId) {
    if (!nodeId) {
      throw '节点 ID 不能为空'
    }
    const node = new TreeNode()
    node.nodeId = nodeId
    return node
  }
  addChild(child) {
    this.children.push(child)
  }
}

/**
 *
 * @param {FamilyNode[]} familyList
 * @returns {TreeNode}
 */
function buildTree(familyList) {
  /** @type {Map<string, TreeNode>} */
  const nodeMap = familyList.reduce((pre, curr) => {
    pre.set(curr.personId, TreeNode.from(curr.personId))
    return pre
  }, new Map())
  familyList.forEach((family) => {
    const currNode = nodeMap.get(family.personId)
    if (family.fatherId) {
      const fatherNode = nodeMap.get(family.fatherId)
      fatherNode.addChild(currNode)
    }
    if (family.motherId) {
      const motherNode = nodeMap.get(family.motherId)
      motherNode.addChild(currNode)
    }
  })
}

export default function LineageTree() {
  return (
    <div>
      <Head>
        <title>世系图算法演示</title>
      </Head>
    </div>
  )
}
