class Tree {
    constructor() {
        this.root = null; // start empty
    }

    emptyTree() {
        return this.root === null;
    }

    plantTree(num) {
        this.root = new Leaf(num);
    }

    addLeaf(num) {
        // Start a new tree if this is the first leaf
        if (this.emptyTree()) return this.plantTree(num);
        
        // Traverse the tree to recursively sort num relative to parent(s)

        // Smaller num to the left, recursively
        if (num < this.root.num) {
            // Add to left if there is room, else traverse left branch
            if (this.root.tryAddLeft(num)) {
                return;
            } else return this.searchTree(this.root.left);
        
        // Larger num to the right, recursively
        } else if (num > this.root.num) {
            // Add to right if there is room, else traverse right branch
            if (this.root.tryAddRight(num)) {
                return;
            } else return this.searchTree(this.root.right);

        // Disregard duplicate adds        
        } else {
            return null;
        }
    }

    removeLeaf(num, root=this.root) {
        // Empty root? Return null
        if (typeof(root) !== Leaf) return null;

        // Removing the root node?
        if (num === root.num) {
            // 0-1 children: null or use only existing branch
            if (root.left === null) return root.right;
            if (root.right === null) return root.left;

            // 2 children: set root equal to smallest on right branch
            root = root.right.smallest();
            root.right = this.removeLeaf(root.right, root.num);

            // This will probably need rebalancing
        } else if (num < root.num) {
            root.left = this.removeLeaf(root.left, num);
        } else {
            root.right = this.removeLeaf(root.right, num);
        }
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

    smallest(num) {
        return;
    }
}