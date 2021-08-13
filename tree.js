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
        
        // Create root
        tree.appendChild(this.root.display());
        // appendChild() for right branches, insertBefore() for left branches


        // Append tree to body
        body.appendChild(tree);
    }

    destroyLeafByNum(num) {
        if (this.emptyTree()) return;

        // TODO
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
        const d = document.createElement("div");
        d.setAttribute("id", this.num + "");
        d.innerHTML = this.num + " ";
        return d;
    }

    toString() {
        const root = this.num;
        const left = ("\n" + this.left).replaceAll("\n","\n\t");
        const right = ("\n" + this.right).replaceAll("\n","\n\t");
        return root + left + right;
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
    const leaves = [1,2,3,4,5,6];
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

const t = randomTree();
t.addLeaf(4);
t.addLeaf(3.9);

t.render();
console.log(String(t));
t.removeLeaf(4);
console.log(String(t));
