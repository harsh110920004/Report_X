const mongoose = require('mongoose');
require('dotenv').config();

const fixIndex = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB\n');

    const db = mongoose.connection.db;
    const collection = db.collection('users');

    // Get all indexes
    const indexes = await collection.indexes();
    console.log('📋 Current indexes:');
    indexes.forEach(idx => {
      console.log(`   - ${idx.name}`);
    });

    // Drop username index if it exists
    const usernameIndex = indexes.find(idx => idx.name === 'username_1');
    
    if (usernameIndex) {
      console.log('\n🔧 Removing username_1 index...');
      await collection.dropIndex('username_1');
      console.log('✅ Successfully removed username_1 index');
    } else {
      console.log('\n⚠️  username_1 index not found (already removed or never existed)');
    }

    // Show remaining indexes
    const remainingIndexes = await collection.indexes();
    console.log('\n📋 Remaining indexes:');
    remainingIndexes.forEach(idx => {
      console.log(`   - ${idx.name}`);
    });

    await mongoose.connection.close();
    console.log('\n✅ Done! You can now register new users.\n');
  } catch (error) {
    console.error('❌ Error:', error.message);
    await mongoose.connection.close();
  }
};

fixIndex();
