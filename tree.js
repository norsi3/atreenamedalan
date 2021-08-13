const animateCSS = (element, animation, prefix = 'animate__') =>
  // We create a Promise and return it
  new Promise((resolve, reject) => {
    const animationName = `${prefix}${animation}`;
    const node = document.querySelector(element);

    node.classList.add(`${prefix}animated`, animationName);

    // When the animation ends, we clean the classes and resolve the Promise
    function handleAnimationEnd(event) {
      event.stopPropagation();
      node.classList.remove(`${prefix}animated`, animationName);
      resolve('Animation ended');
    }

    node.addEventListener('animationend', handleAnimationEnd, {once: true});
  });

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
    
    randomLeaf() {
        const randomAbsNum = (limit) => {
            const fiftyfifty = Math.random() < .5;
            const negative = fiftyfifty ? -1 : 1;
            return ~~(Math.random()*limit*negative);
        }
        
        let num = randomAbsNum(100);
        t.addLeaf(num);
        return num;
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
            
            const buildChildren = (leaf, where) => {
                let node = leaf.display();
                node.addEventListener("click", (e) => {
                    e.stopPropagation();
                    this.removeLeaf(leaf.num);
                    this.destroyTree();
                    this.render();
                });

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
        li.setAttribute("id", "leaf" + this.num);
        li.innerHTML = "<span>" + this.num + "</span>";
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

let t = new Tree();
document.body.onload = t.render.bind(t);

window.onkeypress = (event) => {
    if (event.which === 32) {
        let n = t.randomLeaf();
        t.destroyTree();
        t.render();
        const animation = "swing";
        animateCSS("#leaf" + n, animation);
    }
};