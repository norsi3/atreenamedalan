class Tree {
    constructor() {
        this.root = null; // start empty
    }

    emptyTree() {
        return this.root === null;
    }
    
    addLeaf(num) {
        if (this.emptyTree()) { 
            this.plantTree(num);
            return this.root;
        }

        const insertNum = (num, root) => {
            // Traverse the tree to recursively sort num relative to parent(s)
            // Smaller num to the left, recursively
            if (num < root.num) {
                // Add to left if there is room, else traverse left branch
                if (!root.tryAddLeft(num)) insertNum(num, root.left);
            
            // Larger num to the right, recursively
            } else if (num > root.num) {
                // Add to right if there is room, else traverse right branch
                if (!root.tryAddRight(num)) insertNum(num, root.right);
            }
        };

        insertNum(num, this.root);

        return this.root;
        
    }

    plantTree(num) {
        this.root = new Leaf(num);
        return this.root;
    }

    removeLeaf(num) {
        const removeNum = (num, root, rootSetter) => {
            // Removing the root node?
            if (num === root.num) {
                // 0-1 children: null or use only existing branch
                if (root.left === null) {
                    rootSetter(root.right);
                } else if (root.right === null) {
                    rootSetter(root.left);
                } else {
                    // 2 children: set root equal to smallest on right branch
                    const left = root.left;
                    const right = root.right;
                    const small = root.right.smallest();
                    small.left = left;
                    rootSetter(right);
    
                }

                this.destroyLeafByNum(num);
    
            // Recursively call removeLeaf on children until num === root.num
            } else if (num < root.num) {
                removeNum(num, root.left, (x) => root.left = x);
            } else {
                removeNum(num, root.right, (x) => root.right = x); 
            }
    
        };

        removeNum(num, this.root, (x) => this.root = x);
    }

    render() {
        // Don't bother if there's nothing there
        if (this.emptyTree()) return;

        // Build tree structure before appending to body
        const body = document.getElementsByTagName("body")[0];
        const tree = document.createElement("div");
        tree.setAttribute("id", "tree");
        const mainBranch = document.createElement("ul");
        tree.appendChild(mainBranch);

        const treeRoot = this.root.display();

        const nestedTree = () => {
            let root = this.root;
            // let rootElem = root.display();
            
            const buildChildren = (leaf, where) => {
                let node = leaf.display();
                where.appendChild(node);

                if (leaf.hasLeftChild()) {
                    buildChildren(leaf.left, node);
                }
                if (leaf.hasRightChild()) {
                   buildChildren(leaf.right, node);
                }
            }
            
            buildChildren(root, mainBranch);

            return mainBranch;
        }
        
        tree.appendChild(nestedTree());

        // Append tree to body
        body.appendChild(tree);
    }

    destroyLeafByNum(num) {
        if (this.emptyTree()) return;

        // TODO
    }

    destroyTree() {
        const div = document.querySelectorAll("div");
        for (let d of div) {
            d.remove();
        }
        }
    toString() {
        return String(this.root);
    }



}

class Leaf {
    constructor(num,
                left = null,
                right = null) {
        this.num = num;
        this.left = left;
        this.right = right;
    }

    tryAddLeft(num) {
        if (this.left !== null) return false;
        this.left = new Leaf(num);
        return true;
    }

    tryAddRight(num) {
        if (this.right !== null) return false;
        this.right = new Leaf(num);
        return true;
    }

    smallest() {
        if (this.left === null) return this;

        // Recursively calling smallest() on left child if it exists
        return this.left.smallest();
    }

    display() {
        const li = document.createElement("li");
        li.setAttribute("id", this.num + "");
        li.innerHTML = this.num + " ";
        return li;
    }

    toString() {
        const root = this.num;
        const left = ("\n" + this.left).replaceAll("\n","\n\t");
        const right = ("\n" + this.right).replaceAll("\n","\n\t");
        return root + left + right;
    }

    
    hasRightChild() {
        return this.right !== null;
    }
    
    hasLeftChild() {
        return this.left !== null;
    }

    hasChildren() {
        return this.hasLeftChild() || this.hasRightChild();
    }
}

function randomInt(max) {
    return ~~(Math.random()*max);
}

function randomTree() {
    const rt = new Tree();
    randomLeaves = [...Array(randomInt(15))].map(leaf=>randomInt(15));

    // Remove duplicates
    randomLeaves = [...new Set(randomLeaves)];
    randomLeaves.forEach(leaf => {
        if (leaf !== 0) {
            rt.addLeaf(leaf)
        }
    });

    // Put randomLeaves in order for display as h1
    randomLeaves.sort(function(a, b) { return a - b; });
    const h = document.createElement("h1");
    h.innerHTML = randomLeaves + "";
    document.getElementsByTagName("body")[0].append(h);

    return rt;
}

// randomTree().render();

function fixedTree() {
    const ft = new Tree();
    const leaves = [2,4,5,6,1,3];
    leaves.forEach(
        leaf => {
            ft.addLeaf(leaf);
        }
    );

    const h = document.createElement("h1");
    h.innerHTML = leaves + "";
    document.getElementsByTagName("body")[0].append(h);
    return ft;
}

let t = new Tree();
document.body.onload = t.render.bind(t);

const randomAbsNum = (limit) => {
    const fiftyfifty = Math.random() < .5;
    const negative = fiftyfifty ? -1 : 1;
    return ~~(Math.random()*limit*negative);
}

const randomLeaf = () => {
    let num = randomAbsNum(100);
    console.log("random number", num);
    t.addLeaf(num);
}

window.onkeypress = (event) => {
    if (event.which === 32) {
        randomLeaf();
        t.destroyTree();
        t.render();
    }
};