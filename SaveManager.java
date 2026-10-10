import java.io.FileWriter;
import java.io.IOException;

public class SaveManager {

    public static void save(Player player) {

        try {

            FileWriter writer =
                    new FileWriter("savegame.txt");

            writer.write(
                    "CyberQuest Save File\n"
            );

            writer.write(
                    "Player: "
                            + player.getName()
                            + "\n"
            );

            writer.write(
                    "Health: "
                            + player.getHealth()
                            + "\n"
            );

            writer.write(
                    "Level: "
                            + player.getLevel()
                            + "\n"
            );

            writer.write(
                    "XP: "
                            + player.getXp()
                            + "\n"
            );

            writer.write(
                    "Coins: "
                            + player.getCoins()
                            + "\n"
            );

            writer.close();

            System.out.println(
                    "\n💾 Game saved successfully!"
            );

        } catch (IOException e) {

            System.out.println(
                    "❌ Error while saving game."
            );
        }
    }
}